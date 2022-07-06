"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220706020616 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220706020616 extends migrations_1.Migration {
    up() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addSql('alter table "users" drop constraint "user_username_unique";');
            this.addSql('alter table "users" add constraint "users_username_unique" unique ("username");');
            this.addSql('alter table "posts" alter column "title" type text using ("title"::text);');
            this.addSql('alter table "posts" alter column "title" set not null;');
        });
    }
    down() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addSql('alter table "posts" alter column "title" type text using ("title"::text);');
            this.addSql('alter table "posts" alter column "title" drop not null;');
            this.addSql('alter table "users" drop constraint "users_username_unique";');
            this.addSql('alter table "users" add constraint "user_username_unique" unique ("username");');
        });
    }
}
exports.Migration20220706020616 = Migration20220706020616;
//# sourceMappingURL=Migration20220706020616.js.map