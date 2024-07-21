/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/lifafa.json`.
 */
export type Lifafa = {
  "address": "2h4ToTTMT93ApLUHGqsvFofsD9JSRdLBsMpAxohkgT12",
  "metadata": {
    "name": "lifafa",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "claimSolLifafa",
      "discriminator": [
        209,
        19,
        123,
        104,
        109,
        66,
        48,
        71
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
          "name": "signer",
          "writable": true,
          "signer": true
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
      "name": "createSolLifafa",
      "discriminator": [
        204,
        69,
        222,
        66,
        135,
        118,
        64,
        172
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
          "name": "signer",
          "writable": true,
          "signer": true
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
        }
      ]
    },
    {
      "name": "deleteSolLifafa",
      "discriminator": [
        188,
        252,
        75,
        30,
        255,
        168,
        84,
        151
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
          "name": "signer",
          "writable": true,
          "signer": true
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
      "name": "maxClaimsLimitExceeded",
      "msg": "Max claims limit exceeded"
    },
    {
      "code": 6005,
      "name": "ownerNameTooLong",
      "msg": "Owner name too long"
    },
    {
      "code": 6006,
      "name": "descriptionTooLong",
      "msg": "Description too long"
    }
  ],
  "types": [
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
