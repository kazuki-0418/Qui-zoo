"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const supabase_js_1 = require("@supabase/supabase-js");
// Prisma IClient init
exports.prisma = new client_1.PrismaClient();
// Supabase Client Init
exports.supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
