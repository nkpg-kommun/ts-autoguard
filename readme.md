# @joelek/ts-autoguard

Auto-generated unintrusive type guards for TypeScript.

## Features

Autoguard generates TypeScript type definitions and type guards from schema definitions. Autoguard can read schema definitions from files and from arguments passed directly to the command line utility.

```
autoguard myschema.ag
autoguard "{ MyType: string }"
```

The two commands are identical provided that the schema definition `{ MyType: string }` was saved to the file "myschema.ag".

Autoguard generates and exports type definitions as well as a type guards for the types defined in the schema definition.

```
export type MyType = string;

export const MyType = {
	as(subject: any, path: string = ""): MyType {
		return ((subject, path) => {
			if ((subject != null) && (subject.constructor === String)) {
				return subject;
			}
			throw "Type guard \"String\" failed at \"" + path + "\"!";
		})(subject, path);
	},
	is(subject: any): subject is MyType {
		try {
			MyType.as(subject);
		} catch (error) {
			return false;
		}
		return true;
	}
};
```

Type definitions can be used to annotate TypeScript code and will disappear when transpiled to JavaScript.

Type guards can be used to check whether certain values are type compatible with user-defined types using `MyType.is(...)`. Type guards can even be used to assert type compatibility using `MyType.as(...)`.

Type guards do not disappear when transpiled to JavaScript as they are intended as runtime guards for values where type information only is informally known. This often occurs when reading files or when communicating through APIs.

The schema definition below shows all supported constructs.

```
{
	MyArrayOfStringType: [ string ],
	MyBooleanType: boolean,
	MyNullType: null,
	MyNumberType: number,
	MyObjectType: {
		string_member: string
	},
	MyRecordOfStringType: { string },
	MyReferenceType: @MyObjectType,
	MyStringType: string,
	MyUndefinedType: undefined,
	MyUnionOfStringAndNullType: ( string | null )
}
```

## Configure

This package was developed using TypeScript v3.7.3 and may not work in earlier versions.

Globally install this package from GitHub.

```
npm install -g joelek/ts-autoguard
```

This installs the command line utility "autoguard".

## Syntax

The type language is formally defined as a regular language which shares similarities with the type language in TypeScript.

```
WhiteSpace = "\n" or "\t" or "\r" or " "
OptionalWS = WhiteSpace*
AsciiLetterLowercase = "a" to "z"
AsciiLetterUppercase = "A" to "Z"
AsciiLetter = AsciiLetterLowercase or AsciiLetterUppercase
Digit = "0" to "9"
IdentifierTail = AsciiLetter or Digit or "_"
Identifier = AsciiLetter IdentifierTail*
ArrayType = OptionalWS "[" OptionalWS Type OptionalWS "]" OptionalWS
BooleanType = OptionalWS "boolean" OptionalWS
NullType = OptionalWS "null" OptionalWS
NumberType = OptionalWS "number" OptionalWS
ObjectKeyValue = OptionalWS Identifier OptionalWS ":" OptionalWS Type OptionalWS
ObjectBodyTail = OptionalWS "," OptionalWS ObjectKeyValue
ObjectBody = ObjectKeyValue ObjectBodyTail*
ObjectType = OptionalWS "{" OptionalWS ObjectBody* OptionalWS "}" OptionalWS
RecordType = OptionalWS "{" OptionalWS Type OptionalWS "}" OptionalWS
ReferenceType = OptionalWS "@" Identifier
StringType = OptionalWS "string" OptionalWS
UndefinedType = OptionalWS "undefined" OptionalWS
UnionBodyTail = OptionalWS "|" OptionalWS Type
UnionType = OptionalWS "(" OptionalWS Type UnionBodyTail* OptionalWS ")" OptionalWS
PrimitiveType = BooleanType or NullType or NumberType or StringType or UndefinedType
ComplexType = ArrayType or ObjectType or RecordType or ReferenceType or UnionType
Type = PrimitiveType or ComplexType
SchemaDefinition = ObjectType
```
