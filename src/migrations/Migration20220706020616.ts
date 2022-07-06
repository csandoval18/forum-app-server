import { Migration } from '@mikro-orm/migrations';

export class Migration20220706020616 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "users" drop constraint "user_username_unique";');
    this.addSql('alter table "users" add constraint "users_username_unique" unique ("username");');

    this.addSql('alter table "posts" alter column "title" type text using ("title"::text);');
    this.addSql('alter table "posts" alter column "title" set not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "posts" alter column "title" type text using ("title"::text);');
    this.addSql('alter table "posts" alter column "title" drop not null;');

    this.addSql('alter table "users" drop constraint "users_username_unique";');
    this.addSql('alter table "users" add constraint "user_username_unique" unique ("username");');
  }

}
