import type { Freelancer } from "@/lib/types";

const STORE: Freelancer[] = [];

export function listFreelancers(): Freelancer[] {
  return STORE;
}

export function seedFreelancers(rows: Freelancer[]) {
  STORE.splice(0, STORE.length, ...rows);
}
