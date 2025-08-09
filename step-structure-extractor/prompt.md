Write a TypeScript project that analyzes the ESMeta Abstract Syntax Tree of the Abstract Operations of the ECMA-262 specification and extracts all the possible cases of a given language construct.

Input:
- algorithmsFolder: the path of the folder containing the ESMeta ASTs of the Abstract Operations
- algorithmExcludeFilter: a set of Abstract Operation types (accepted element values are: "abstract operation", "numeric method", "concrete method", "internal method", "builtin method", "sdo")
- step: the type name of a step in the ESMeta language

Output:
- it generates a file containing the different cases for the given step.

Algorithm:
- let occurrences be an empty list
- filter the JSON files in the given folder according to the property key of their Algorithm.head object, and based on algorithmTypeFilter:
    - if the filter includes "abstract operation" and the key is "AbstractOperationHead", exclude the algorithm. else keep it.
    - if the filter includes "numeric method" and the key is "NumericMethodHead", exclude the algorithm. else keep it.
    - if the filter includes "concrete method" and the key is "ConcreteMethodHead", exclude the algorithm. else keep it.
    - if the filter includes "internal method" and the key is "InternalMethodHead", exclude the algorithm. else keep it.
    - if the filter includes "builtin method" and the key is "BuiltinMethodHead", exclude the algorithm. else keep it.
    - if the filter includes "sdo" and the key is "SyntaxDirectedOperationHead", exclude the algorithm. else keep it.
- for each remaining JSON file kept after the filtering operation 
    - look for the JSON Path query `$.Algorithm.body..<type name of the step>`
    - for each query result
        - transform its subtree such that each property value that is a primitive value (ie. string, null, undefined, boolean) is replaced with its type name (eg. a branch that ends with {"name": "foo", "value": true, "info": null} is transformed to {"name": "string", "value": "boolean", "info": "null"})
        - if occurrences already includes an element whose "step" property has the same structure of this subtree, add the name of this abstract operation to its "appearsIn" property
        - otherwise, add a new element to occurrences, which is an object with two properties:
            - "step": this subtree
            - "appearsIn": the name of this abstract operation

Example
Input:
    - folder: '/path/to/folder'
    - step: 'LetStep'
Output:

[
  {
    "step": {
      "LetStep": {
        "variable": {
          "Variable": {
            "name": "string"
          }
        },
        "expr": {
          "ReturnIfAbruptExpression": {
            "expr": {
              "InvokeAbstractOperationExpression": {
                "name": "string",
                "args": [
                  {
                    "ReferenceExpression": {
                      "ref": {
                        "Variable": {
                          "Variable": {
                            "name": "string"
                          }
                        }
                      }
                    }
                  },
                  {
                    "EnumLiteral": {
                      "name": "string"
                    }
                  }
                ]
              }
            },
            "check": "boolean"
          }
        }
      }
    },
    "appearsIn": [
      "ValidateIntegerTypedArray", ...
    ]
  }, 
  ...
]
 - variable
     - Variable 
         - name
 - expr
     - ReferenceExpression
 */