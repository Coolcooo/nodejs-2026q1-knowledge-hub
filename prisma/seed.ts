import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Status, Role } from '../src/generated/prisma/client';
import { randomUUID } from 'node:crypto';
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminId = randomUUID();
  await prisma.user.upsert({
    create: {
      id: adminId,
      login: 'testuser1',
      password: 'secret1',
      role: Role.admin,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    where: { id: adminId },
    update: {},
  });

  const editorId = randomUUID();
  await prisma.user.upsert({
    create: {
      id: editorId,
      login: 'testuser2',
      password: 'secret2',
      role: Role.editor,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    where: { id: editorId },
    update: {},
  });

  const itCategoryId = randomUUID();
  await prisma.category.upsert({
    create: {
      id: itCategoryId,
      name: 'testcategory1',
      description: 'testcategorydescription1',
    },
    where: { id: itCategoryId },
    update: {},
  });

  const managementCategoryId = randomUUID();
  await prisma.category.upsert({
    create: {
      id: managementCategoryId,
      name: 'testcategory2',
      description: 'testcategorydescription2',
    },
    where: { id: managementCategoryId },
    update: {},
  });

  const learnCategoryId = randomUUID();
  await prisma.category.upsert({
    create: {
      id: learnCategoryId,
      name: 'learn',
      description: 'lear description',
    },
    where: { id: learnCategoryId },
    update: {},
  });

  const itArticleId = randomUUID();
  await prisma.article.upsert({
    create: {
      id: itArticleId,
      title: 'article1',
      content: 'articleContent1',
      status: Status.published,
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: editorId,
      categoryId: itCategoryId,
      tags: {
        connectOrCreate: [
          {
            create: { id: randomUUID(), name: 'tag1' },
            where: { name: 'tag1' },
          },
          {
            create: { id: randomUUID(), name: 'tag2' },
            where: { name: 'tag2' },
          },
          {
            create: { id: randomUUID(), name: 'tag3' },
            where: { name: 'tag3' },
          },
        ],
      },
    },
    where: { id: itArticleId },
    update: {},
  });

  const it2ArticleId = randomUUID();
  await prisma.article.upsert({
    create: {
      id: it2ArticleId,
      title: 'artifsdcle1',
      content: 'articlsdafeContent1',
      status: Status.draft,
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: editorId,
      categoryId: itCategoryId,
      tags: {
        connectOrCreate: [
          {
            create: { id: randomUUID(), name: 'tag1' },
            where: { name: 'tag1' },
          },
          {
            create: { id: randomUUID(), name: 'tag2' },
            where: { name: 'tag2' },
          },
          {
            create: { id: randomUUID(), name: 'tag3' },
            where: { name: 'tag3' },
          },
        ],
      },
    },
    where: { id: it2ArticleId },
    update: {},
  });

  const managementArticleId = randomUUID();
  await prisma.article.upsert({
    create: {
      id: managementArticleId,
      title: 'articlfasde1',
      content: 'articleContbvcent1',
      status: Status.draft,
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: editorId,
      categoryId: managementCategoryId,
      tags: {
        connectOrCreate: [
          {
            create: { id: randomUUID(), name: 'tag1' },
            where: { name: 'tag1' },
          },
          {
            create: { id: randomUUID(), name: 'tag2' },
            where: { name: 'tag2' },
          },
          {
            create: { id: randomUUID(), name: 'tag3' },
            where: { name: 'tag3' },
          },
        ],
      },
    },
    where: { id: managementArticleId },
    update: {},
  });

  const testArticleId = randomUUID();
  await prisma.article.upsert({
    create: {
      id: testArticleId,
      title: 'articlfe1',
      content: 'artntbvcent1',
      status: Status.archived,
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: editorId,
      categoryId: learnCategoryId,
      tags: {
        connectOrCreate: [
          {
            create: { id: randomUUID(), name: 'tag1' },
            where: { name: 'tag1' },
          },
          {
            create: { id: randomUUID(), name: 'tag2' },
            where: { name: 'tag2' },
          },
          {
            create: { id: randomUUID(), name: 'tag3' },
            where: { name: 'tag3' },
          },
        ],
      },
    },
    where: { id: testArticleId },
    update: {},
  });

  const test2ArticleId = randomUUID();
  await prisma.article.upsert({
    create: {
      id: test2ArticleId,
      title: 'articlfe1',
      content: 'artntbvcent1',
      status: Status.draft,
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: editorId,
      categoryId: learnCategoryId,
      tags: {
        connectOrCreate: [
          {
            create: { id: randomUUID(), name: 'ruty' },
            where: { name: 'ruty' },
          },
          {
            create: { id: randomUUID(), name: 'bnvbcvng' },
            where: { name: 'bnvbcvng' },
          },
          {
            create: { id: randomUUID(), name: 'asdgdfsg' },
            where: { name: 'asdgdfsg' },
          },
        ],
      },
    },
    where: { id: test2ArticleId },
    update: {},
  });

  let id = randomUUID();
  await prisma.comment.upsert({
    create: {
      id: id,
      content: 'artntbvcent1',
      createdAt: new Date(),
      authorId: editorId,
      articleId: test2ArticleId,
    },
    where: { id: id },
    update: {},
  });

  id = randomUUID();
  await prisma.comment.upsert({
    create: {
      id: id,
      content: 'artntbvcent2',
      createdAt: new Date(),
      authorId: editorId,
      articleId: test2ArticleId,
    },
    where: { id: id },
    update: {},
  });

  id = randomUUID();
  await prisma.comment.upsert({
    create: {
      id: id,
      content: 'artntbvcfasdf asdf asf fsafent2',
      createdAt: new Date(),
      authorId: editorId,
      articleId: test2ArticleId,
    },
    where: { id: id },
    update: {},
  });

  id = randomUUID();
  await prisma.comment.upsert({
    create: {
      id: id,
      content: 'artntbvcent1',
      createdAt: new Date(),
      authorId: editorId,
      articleId: itArticleId,
    },
    where: { id: id },
    update: {},
  });

  id = randomUUID();
  await prisma.comment.upsert({
    create: {
      id: id,
      content: 'artntbvcent2',
      createdAt: new Date(),
      authorId: editorId,
      articleId: itArticleId,
    },
    where: { id: id },
    update: {},
  });

  id = randomUUID();
  await prisma.comment.upsert({
    create: {
      id: id,
      content: 'artntbvcfasdf asdf asf fsafent2',
      createdAt: new Date(),
      authorId: editorId,
      articleId: itArticleId,
    },
    where: { id: id },
    update: {},
  });
}
main()
  .then(() => {
    prisma.$disconnect();
    pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
