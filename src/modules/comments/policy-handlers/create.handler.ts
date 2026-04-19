import { TPolicyHandler } from '../../../metadata/roles.metadata';
import {
  AppAbility,
  Entity,
} from '../../casl/casl-ability.factory/casl-ability.factory';
import { Action } from '../../../contants';

export class CreatePolicyHandler implements TPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Create, Entity.Comment);
  }
}
