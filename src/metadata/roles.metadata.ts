import { SetMetadata } from '@nestjs/common';
import { AppAbility } from '../modules/casl/casl-ability.factory/casl-ability.factory';

export type TPolicyHandler = {
  handle(ability: AppAbility): boolean;
};

type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandler = TPolicyHandler | PolicyHandlerCallback;

export const CHECK_POLICIES_KEY = 'check_policy';
export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
