# actions-set-output

[![CI](https://github.com/spenserblack/actions-set-output/actions/workflows/ci.yml/badge.svg)](https://github.com/spenserblack/actions-set-output/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/spenserblack/actions-set-output/branch/master/graph/badge.svg?token=sjIjnQnIVu)](https://codecov.io/gh/spenserblack/actions-set-output)

I always forget how to set output in steps, so this is a helper action for setting outputs.
There's probably several actions like this already.

## Usage

```yaml

- uses: spenserblack/actions-set-output@<commit-ish>
  id: output-step
  with:
    variables: |
      FOO=BAR
      VERSION=$(git describe --tags)
- run: echo "FOO is ${{ steps.output-step.outputs.FOO }}"
- run: echo "version is ${{ steps.output-step.outputs.VERSION }}"
```
