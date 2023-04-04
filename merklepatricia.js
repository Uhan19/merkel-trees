const Trie = require("merkle-patricia-tree").SecureTrie; // We import the library required to create a basic Merkle Patricia Tree
const { BranchNode } = require("merkle-patricia-tree/dist/trieNode");

var trie = new Trie(); // We create an empty Patricia Merkle Tree

const traverseTrie = (node) => {
  trie.walkTrie(node, (_, node) => {
    if (node) {
      console.log(node);
      console.log(node.hash().toString("hex"));
      if (node instanceof BranchNode) {
        for (let i = 0; i < 16; i++) {
          const buffer = node.getBranch(i);
          if (buffer && buffer.length > 0) {
            traverseTrie(buffer);
          }
        }
      }
    }
  });
};

async function test() {
  await trie.put(
    Buffer.from("32fa7c"),
    // ASCII Text to Hex 32 30
    Buffer.from("20")
  );

  traverseTrie(trie.root);

  console.log("Root Hash: ", trie.root.toString("hex"));
}

test();

// Keccak256(key) as a string. Key = '32fa7c'
// 4f6c1c50fde5f5d4f20c2979974a8f465b24e65062f02ef80f722200f35105e2

// add 20 hex prefix if nibbles are even
// 204f6c1c50fde5f5d4f20c2979974a8f465b24e65062f02ef80f722200f35105e2

// 0x80 + 33 (length in bytes) = a1
// 0x80 + 2 (length in bytes of 3230) = 82
// 0xc0 + 37 (length in bytes of a1204f6c1c50fde5f5d4f20c2979974a8f465b24e65062f02ef80f722200f35105e2823230) = e5
// e5 a1 204f6c1c50fde5f5d4f20c2979974a8f465b24e65062f02ef80f722200f35105e2 82 3230

// keccak256(RLP), RLP = e5a1204f6c1c50fde5f5d4f20c2979974a8f465b24e65062f02ef80f722200f35105e2823230
// 17dee68b36b0276d8db503b497c8335d5d4ace0ed3fef5f6fa62644dcd66f170

// https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/

/* roothash in hex
    1 nibble is 4 bits, 1 byte is 8 bits, 1 hex is 4 bits
    so 1nibble = 1hex

    1 bit = 0 or 1
    so 3 = 0011 in bits
       3 = 0x03 in hex
       3 = 11 in binary
       3 = 3 in nibbles (4 bits)
    
    Ex: 0x32fa7c21
    - 4 bytes
    - 8 nibbles
    - 8 hexadecimal digits
    - 32 bits

  _nibbles: [
     4, 15,  6, 12,  1, 12,  5,  0, 15, 13, 14, 5,
    15,  5, 13,  4, 15,  2,  0, 12,  2,  9,  7, 9,
     9,  7,  4, 10,  8, 15,  4,  6,  5, 11,  2, 4,
    14,  6,  5,  0,  6,  2, 15,  0,  2, 14, 15, 8,
     0, 15,  7,  2,  2,  2,  0,  0, 15,  3,  5, 1,
     0,  5, 14,  2
  ],
*/
