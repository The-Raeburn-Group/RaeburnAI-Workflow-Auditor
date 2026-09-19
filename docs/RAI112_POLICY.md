# RAI-112 reusable software supply-chain policy

This repository is the versioned policy-as-code host for the common RAI-112 baseline.

## Reusable action

A repository can invoke the policy after checkout with a commit-pinned reference:

```yaml
- uses: The-Raeburn-Group/RaeburnAI-Workflow-Auditor/.github/actions/rai112-policy@<40-character-commit-sha>
  with:
    profile: application
```

The action runs the versioned validator from this repository against the caller's checked-out workspace. Consumers should pin the action to an exact commit SHA.

## Application profile

The application profile checks:

- every third-party GitHub Action uses a full 40-character commit SHA
- a deterministic dependency lock exists
- npm projects with `package-lock.json` use `npm ci`
- a High/Critical dependency audit gate exists
- CodeQL init and analyze are present when required by `.rai112-policy.json`
- external Docker bases are pinned by OCI SHA-256 digest
- Trivy is present when container assurance is required
- a live HTTP health probe exists when runtime proof is required

Repository-specific requirements are declared in `.rai112-policy.json`, keeping common policy separate from legitimate architectural differences.

## Release profile

The release profile adds deterministic archive, normalized gzip, SHA-256 manifest, SPDX/CycloneDX SBOMs, Sigstore signing and verification, GitHub attestations and exactly one release-file publisher.

Passing source validation is not equivalent to release execution. Real release evidence still requires an executed exact-tag workflow and inspection of its published assets.

## Evidence boundary

This policy action provides machine-enforced repository policy. It does not substitute for GitHub organisation rulesets, Actions billing/provisioning, or protected-branch administration. Those controls remain platform administration responsibilities.
