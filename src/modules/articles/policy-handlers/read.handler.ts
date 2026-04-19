import { TPolicyHandler } from '../../../metadata/roles.metadata';
import {
  AppAbility,
  Entity,
} from '../../casl/casl-ability.factory/casl-ability.factory';
import { Action } from '../../../contants';

export class ReadPolicyHandler implements TPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Read, Entity.Article);
  }
}
