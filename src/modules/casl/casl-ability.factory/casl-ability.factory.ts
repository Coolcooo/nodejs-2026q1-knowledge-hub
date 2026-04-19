import { Injectable } from '@nestjs/common';
import { AbilityBuilder, ExtractSubjectType, PureAbility } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import {
  Article,
  User,
  Comment,
  Tag,
  Category,
} from '../../../generated/prisma/client';
import { Action, Role } from '../../../contants';
import { TRole } from '../../../types';

type Subs =
  | 'all'
  | Subjects<{
      User: User;
      Article: Article;
      Comment: Comment;
      Tag: Tag;
      Category: Category;
    }>;
export type AppAbility = PureAbility<[string, Subs], PrismaQuery>;

export const Entity = {
  User: 'User',
  Article: 'Article',
  Comment: 'Comment',
  Tag: 'Tag',
  Category: 'Category',
} as const;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: { role: TRole; userId: string }) {
    const { can, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);
    switch (user.role) {
      case Role.ADMIN: {
        can(Action.Manage, 'all');
        break;
      }
      case Role.VIEWER: {
        can(Action.Read, 'all');
        break;
      }
      case Role.EDITOR: {
        can(Action.Read, 'all');
        can(Action.Create, Entity.Article);
        can(Action.Create, Entity.Comment);
        can(Action.Update, Entity.Article, { authorId: user.userId });
        can(Action.Update, Entity.Comment, { authorId: user.userId });
        can(Action.Delete, Entity.Comment, { authorId: user.userId });
        can(Action.Delete, Entity.Article, { authorId: user.userId });
        can(Action.Delete, Entity.Article, { authorId: user.userId });
        break;
      }
      default: {
        break;
      }
    }
    return build({
      detectSubjectType: (item) =>
        item.constructor.name as ExtractSubjectType<Subs>,
    });
  }
}
