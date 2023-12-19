import nacl_factory from "js-nacl";
export let nacl: nacl_factory.Nacl;
async function main() {
    nacl = await nacl_factory.instantiate(()=>0);
}
main();
