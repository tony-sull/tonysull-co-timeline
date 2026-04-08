declare namespace App {
  interface Locals {
    indiepub?: import('@indiepub/astro').IndiePubLocals;
    member?: import('@indiepub/astro').MemberSession | null;
  }
}
