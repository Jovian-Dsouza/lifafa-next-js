/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/lifafa.json`.
 */
export type Lifafa = {
  "address": "ExMuFdSFp8GKGcT2TmqzzQQ6BcxxCuEGi5JcbmUBbxfK",
  "metadata": {
    "name": "lifafa",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "claimSplLifafa",
      "discriminator": [
        119,
        1,
        232,
        147,
        15,
        182,
        50,
        229
      ],
      "accounts": [
        {
          "name": "lifafa",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  102,
                  97,
                  102,
                  97
                ]
              },
              {
                "kind": "arg",
                "path": "id"
              }
            ]
          }
        },
        {
          "name": "mint"
        },
        {
          "name": "ata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "userClaim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  99,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "account",
                "path": "lifafa"
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createSplLifafa",
      "discriminator": [
        137,
        175,
        110,
        168,
        40,
        51,
        250,
        93
      ],
      "accounts": [
        {
          "name": "lifafa",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  102,
                  97,
                  102,
                  97
                ]
              },
              {
                "kind": "arg",
                "path": "id"
              }
            ]
          }
        },
        {
          "name": "mint"
        },
        {
          "name": "ata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "vault",
          "writable": true
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "u64"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "timeLimitInSeconds",
          "type": "i64"
        },
        {
          "name": "maxClaims",
          "type": "u64"
        },
        {
          "name": "ownerName",
          "type": "string"
        },
        {
          "name": "desc",
          "type": "string"
        },
        {
          "name": "claimMode",
          "type": "u8"
        }
      ]
    },
    {
      "name": "deleteSplLifafa",
      "discriminator": [
        186,
        16,
        66,
        222,
        7,
        72,
        210,
        40
      ],
      "accounts": [
        {
          "name": "lifafa",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  102,
                  97,
                  102,
                  97
                ]
              },
              {
                "kind": "arg",
                "path": "id"
              }
            ]
          }
        },
        {
          "name": "mint"
        },
        {
          "name": "ata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "vault",
          "writable": true
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "lifafa",
      "discriminator": [
        50,
        94,
        121,
        47,
        119,
        66,
        206,
        200
      ]
    },
    {
      "name": "userClaim",
      "discriminator": [
        228,
        142,
        195,
        181,
        228,
        147,
        32,
        209
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "timeLimitExpired",
      "msg": "TimeLimit has expired"
    },
    {
      "code": 6001,
      "name": "unauthorized",
      "msg": "unauthorized"
    },
    {
      "code": 6002,
      "name": "alreadyClaimed",
      "msg": "Already claimed"
    },
    {
      "code": 6003,
      "name": "maxClaimsReached",
      "msg": "Max Claims Reached"
    },
    {
      "code": 6004,
      "name": "ownerNameTooLong",
      "msg": "Owner name too long"
    },
    {
      "code": 6005,
      "name": "descriptionTooLong",
      "msg": "Description too long"
    },
    {
      "code": 6006,
      "name": "lifafaAlreadyExists",
      "msg": "Lifafa Already Exists"
    },
    {
      "code": 6007,
      "name": "invalidClaimMode",
      "msg": "Invalid Claim Mode"
    }
  ],
  "types": [
    {
      "name": "claimMode",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "random"
          },
          {
            "name": "equal"
          }
        ]
      }
    },
    {
      "name": "lifafa",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "creationTime",
            "type": "i64"
          },
          {
            "name": "timeLimit",
            "type": "i64"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "ownerName",
            "type": "string"
          },
          {
            "name": "claims",
            "type": "u64"
          },
          {
            "name": "maxClaims",
            "type": "u64"
          },
          {
            "name": "mintOfTokenBeingSent",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "desc",
            "type": "string"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "claimMode",
            "type": {
              "defined": {
                "name": "claimMode"
              }
            }
          }
        ]
      }
    },
    {
      "name": "userClaim",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "claimed",
            "type": "bool"
          },
          {
            "name": "amountClaimed",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
