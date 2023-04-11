import { MinimalResolveOptions } from '@yarnpkg/core'
import { ResolveOptions }        from '@yarnpkg/core'
import { Resolver }              from '@yarnpkg/core'
import { Descriptor }            from '@yarnpkg/core'
import { DescriptorHash }        from '@yarnpkg/core'
import { Locator }               from '@yarnpkg/core'
import { Package }               from '@yarnpkg/core'
import { semverUtils }           from '@yarnpkg/core'
import { structUtils }           from '@yarnpkg/core'

import semver                    from 'semver'

export const TAG_REGEXP = /^(?!v)[a-z0-9._-]+$/i

export class ProtocolResolver implements Resolver {
  supportsDescriptor(descriptor: Descriptor, opts: MinimalResolveOptions) {
    if (semverUtils.validRange(descriptor.range)) return true

    if (TAG_REGEXP.test(descriptor.range)) return true

    return false
  }

  supportsLocator(locator: Locator, opts: MinimalResolveOptions) {
    if (semver.valid(locator.reference)) return true

    if (TAG_REGEXP.test(locator.reference)) return true

    return false
  }

  shouldPersistResolution(locator: Locator, opts: MinimalResolveOptions) {
    return opts.resolver.shouldPersistResolution(this.forwardLocator(locator, opts), opts)
  }

  bindDescriptor(descriptor: Descriptor, fromLocator: Locator, opts: MinimalResolveOptions) {
    return opts.resolver.bindDescriptor(this.forwardDescriptor(descriptor, opts), fromLocator, opts)
  }

  getResolutionDependencies(descriptor: Descriptor, opts: MinimalResolveOptions) {
    return opts.resolver.getResolutionDependencies(this.forwardDescriptor(descriptor, opts), opts)
  }

  async getCandidates(
    descriptor: Descriptor,
    dependencies: Record<DescriptorHash, Package>,
    opts: ResolveOptions
  ) {
    return opts.resolver.getCandidates(this.forwardDescriptor(descriptor, opts), dependencies, opts)
  }

  async getSatisfying(
    descriptor: Descriptor,
    dependencies: Record<string, Package>,
    locators: Locator[],
    opts: ResolveOptions
  ) {
    return opts.resolver.getSatisfying(
      this.forwardDescriptor(descriptor, opts),
      dependencies,
      locators,
      opts
    )
  }

  async resolve(locator: Locator, opts: ResolveOptions) {
    const pkg = await opts.resolver.resolve(this.forwardLocator(locator, opts), opts)

    return structUtils.renamePackage(pkg, locator)
  }

  private forwardDescriptor(descriptor: Descriptor, opts: MinimalResolveOptions) {
    return structUtils.makeDescriptor(
      descriptor,
      `${opts.project.configuration.get(`defaultProtocol`)}${descriptor.range}`
    )
  }

  private forwardLocator(locator: Locator, opts: MinimalResolveOptions) {
    return structUtils.makeLocator(
      locator,
      `${opts.project.configuration.get(`defaultProtocol`)}${locator.reference}`
    )
  }
}
