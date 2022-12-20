# rd-schema

JSON schemas for [Rhythm Doctor](https://rhythmdr.com/) levels.

They can be used with [Visual Studio Code](https://code.visualstudio.com/) to
provide validation and completion suggestions. For `rdlevel` files, add the
following to the top level object of your `settings.json`:

```json
{
  "files.associations": {
    "*.rdlevel": "json"
  },
  "json.schemas": [
    {
      "fileMatch": [
        "*.rdlevel"
      ],
      "url": "https://0f-0b.github.io/rd-schema/level.json"
    }
  ]
}
```

For custom characters, add the following to each JSON file:

```json
{
  "$schema": "https://0f-0b.github.io/rd-schema/character.json"
}
```
