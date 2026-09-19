import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const policyRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const controlSet = JSON.parse(fs.readFileSync(path.join(policyRoot, 'policy', 'rai112-control-set.json'), 'utf8'));

function walk(root, predicate) {
  const results = [];
  if (!fs.existsSync(root)) return results;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === '.next') continue;
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) results.push(...walk(full, predicate));
    else if (predicate(full)) results.push(full);
  }
  return results;
}

function rel(root, file) {
  return path.relative(root, file).replaceAll(path.sep, '/');
}

function auditRepository(root, overrides = {}) {
  root = path.resolve(root);
  const failures = [];
  const evidence = [];
  const configPath = path.join(root, '.rai112-policy.json');
  const config = fs.existsSync(configPath)
    ? { ...JSON.parse(fs.readFileSync(configPath, 'utf8')), ...overrides }
    : { profile: 'application', containerRequired: false, runtimeSmokeRequired: false, codeqlRequired: true, releaseTrustRequired: false, ...overrides };

  const workflowsDir = path.join(root, '.github', 'workflows');
  const workflowFiles = fs.existsSync(workflowsDir)
    ? fs.readdirSync(workflowsDir).filter((name) => /\.ya?ml$/i.test(name)).sort().map((name) => path.join(workflowsDir, name))
    : [];
  if (workflowFiles.length === 0) failures.push('.github/workflows must contain at least one workflow');

  const workflowSources = workflowFiles.map((file) => ({ file, source: fs.readFileSync(file, 'utf8') }));
  const allWorkflows = workflowSources.map(({ source }) => source).join('\n');

  const uses = /^\s*-?\s*uses:\s*([^\s#]+)(?:\s+#.*)?$/gm;
  for (const { file, source } of workflowSources) {
    for (const match of source.matchAll(uses)) {
      const ref = match[1];
      if (ref.startsWith('./') || ref.startsWith('docker://')) continue;
      const at = ref.lastIndexOf('@');
      const version = at >= 0 ? ref.slice(at + 1) : '';
      if (!/^[0-9a-f]{40}$/i.test(version)) {
        failures.push(rel(root, file) + ' has mutable third-party Action ref: ' + ref);
      }
    }
  }
  if (!failures.some((f) => f.includes('mutable third-party Action'))) evidence.push('all third-party Actions use full commit SHAs');

  const lockNames = new Set(['package-lock.json', 'pnpm-lock.yaml', 'yarn.lock', 'requirements.lock', 'requirements-dev.lock']);
  const lockfiles = walk(root, (file) => lockNames.has(path.basename(file)));
  if (lockfiles.length === 0) failures.push('at least one committed dependency lockfile is required');
  else evidence.push('dependency lockfiles: ' + lockfiles.map((file) => rel(root, file)).join(', '));

  if (fs.existsSync(path.join(root, 'package.json')) && fs.existsSync(path.join(root, 'package-lock.json'))) {
    if (!allWorkflows.includes('npm ci')) failures.push('npm projects with package-lock.json must use npm ci in CI');
    if (!allWorkflows.includes('npm audit --audit-level=high')) failures.push('npm projects must block High/Critical findings with npm audit --audit-level=high');
  }
  const hasDependencyAudit = [
    'npm audit --audit-level=high',
    'pnpm audit --audit-level high',
    'pip-audit',
    'pip_audit'
  ].some((marker) => allWorkflows.includes(marker));
  if (!hasDependencyAudit) failures.push('no High/Critical dependency audit gate found in workflows');
  else evidence.push('High/Critical dependency audit gate found');

  if (config.codeqlRequired) {
    if (!allWorkflows.includes('github/codeql-action/init@') || !allWorkflows.includes('github/codeql-action/analyze@')) {
      failures.push('CodeQL init and analyze are required');
    } else evidence.push('CodeQL init/analyze found');
  }

  const dockerfiles = walk(root, (file) => /(^|\/)Dockerfile(?:\.[^/]+)?$/i.test(file));
  if (config.containerRequired && dockerfiles.length === 0) failures.push('containerRequired=true but no Dockerfile was found');

  for (const dockerfile of dockerfiles) {
    const source = fs.readFileSync(dockerfile, 'utf8');
    const stageNames = new Set();
    for (const line of source.split('\n')) {
      const match = line.trim().match(/^FROM\s+([^\s]+)(?:\s+AS\s+([^\s]+))?/i);
      if (!match) continue;
      const image = match[1];
      if (!stageNames.has(image) && image.toLowerCase() !== 'scratch' && !/@sha256:[0-9a-f]{64}$/i.test(image)) {
        failures.push(rel(root, dockerfile) + ' has non-digest-pinned external base: ' + image);
      }
      if (match[2]) stageNames.add(match[2]);
    }
    if (fs.existsSync(path.join(root, 'package-lock.json')) && source.includes('npm install') && !source.includes('npm ci')) {
      failures.push(rel(root, dockerfile) + ' must use npm ci when package-lock.json exists');
    }
  }
  if (dockerfiles.length > 0 && !failures.some((f) => f.includes('non-digest-pinned external base'))) {
    evidence.push('external Docker bases are digest-pinned');
  }

  if (config.containerRequired) {
    if (!allWorkflows.includes('aquasecurity/trivy-action@')) failures.push('Trivy High/Critical container scan is required');
    else evidence.push('Trivy container scan found');
  }

  if (config.runtimeSmokeRequired) {
    const hasHealthMarker = /(healthz|\/health|api\/health)/i.test(allWorkflows);
    const hasProbe = /(curl\s+--fail|curl\s+-f|wget\s+.*http|fetch\(['"]http)/i.test(allWorkflows);
    if (!hasHealthMarker || !hasProbe) failures.push('live runtime smoke test with an HTTP health probe is required');
    else evidence.push('live HTTP runtime smoke test found');
  }

  if (config.releaseTrustRequired || config.profile === 'release') {
    for (const marker of controlSet.releaseTrustMarkers) {
      if (!allWorkflows.includes(marker)) failures.push('release trust is missing marker: ' + marker);
    }
    const publisherCount =
      (allWorkflows.match(/gh release upload/g) || []).length +
      (allWorkflows.match(/softprops\/action-gh-release@/g) || []).length;
    if (publisherCount !== 1) failures.push('release trust must have exactly one file publisher; found ' + publisherCount);
    else evidence.push('single release file publisher found');
  }

  return {
    policy: controlSet.id,
    policyVersion: controlSet.version,
    root,
    config,
    passed: failures.length === 0,
    failures,
    evidence
  };
}

const args = process.argv.slice(2);
let target = '.';
let profile;
for (let i = 0; i < args.length; i += 1) {
  if (args[i] === '--profile') profile = args[++i];
  else target = args[i];
}
const result = auditRepository(target, profile ? { profile, releaseTrustRequired: profile === 'release' } : {});
if (!result.passed) {
  console.error('RAI-112 policy validation failed:');
  for (const failure of result.failures) console.error('- ' + failure);
  process.exit(1);
}
console.log('RAI-112 policy validated (' + result.policyVersion + '):');
for (const item of result.evidence) console.log('- ' + item);

export { auditRepository };
