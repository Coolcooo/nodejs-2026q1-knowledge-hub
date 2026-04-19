import { TPolicyHandler } from '../../../metadata/roles.metadata';
import {
  AppAbility,
  Entity,
} from '../../casl/casl-ability.factory/casl-ability.factory';
import { Action } from '../../../contants';

export class UpdatePolicyHandler implements TPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Update, Entity.Category);
  }
}
