# actions-set-output

[![CI](https://github.com/spenserblack/actions-set-output/actions/workflows/ci.yml/badge.svg)](https://github.com/spenserblack/actions-set-output/actions/workflows/ci.yml)

:warning: It is probably best to use the `::set-output` workflow command instead of using this action.

I always forget how to set output in steps, so this is a helper action for setting outputs.
There's probably several actions like this already.

This action is a wrapper around the [dotenv gem](https://github.com/bkeepers/dotenv), so
anything that would be valid in a `.env` file is valid for the `variables` input.

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

### Windows and MacOS runners

This action is a Docker action, which currently can only run on Linux runners. To work around this,
you can use the outputs from a Linux job in a Windows or MacOS job.

```yaml
jobs:
  make-outputs:
    runs-on: ubuntu-latest
    outputs:
      FOO: ${{ steps.output-step.outputs.FOO }}
      VERSION: ${{ steps.output-step.outputs.VERSION }}
    steps:
      - uses: spenserblack/actions-set-output@<commit-ish>
        id: output-step
        with:
          variables: |
            FOO=BAR
            VERSION=$(git describe --tags)
  main-job:
    runs-on: ${{ matrix.os }}
    needs: [make-outputs]
    strategy:
      matrix:
        os: [macos-latest, windows-latest]
    steps:
      - run: echo "FOO is ${{ needs.make-outputs.outputs.FOO }}"
      - run: echo "version is ${{ needs.make-outputs.outputs.VERSION }}"
```
