import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
export const runtime = "nodejs";
export async function GET() {
  try {
    const rows = await sql()`SELECT id, expense_date, merchant, category, amount, household_member FROM expenses ORDER BY expense_date DESC, id DESC`;
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({error:error instanceof Error?error.message:"Database error"},{status:500});
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const merchant=String(body.merchant||"").trim();
    const amount=Number(body.amount);
    if (!merchant || !Number.isFinite(amount) || amount<=0) return NextResponse.json({error:"Merchant and a positive amount are required"},{status:400});
    const rows=await sql()`INSERT INTO expenses (expense_date,merchant,category,amount,household_member) VALUES (${body.date||new Date().toISOString().slice(0,10)},${merchant},${body.category||"Other"},${amount},${body.member||"Saad"}) RETURNING id, expense_date, merchant, category, amount, household_member`;
    return NextResponse.json(rows[0],{status:201});
  } catch (error) {
    return NextResponse.json({error:error instanceof Error?error.message:"Database error"},{status:500});
  }
}