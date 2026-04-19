import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  AppAbility,
  CaslAbilityFactory,
} from '../modules/casl/casl-ability.factory/casl-ability.factory';
import { CHECK_POLICIES_KEY, PolicyHandler } from '../metadata/roles.metadata';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    const policyHandlers = this.reflector.get<PolicyHandler[]>(
      CHECK_POLICIES_KEY,
      context.getHandler(),
    );
    if (!policyHandlers) {
      return true;
    }
    const ability = this.caslAbilityFactory.createForUser(user);
    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    );
  }

  execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
