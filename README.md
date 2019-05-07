# A lightweight CLI based In Time Calculator for [greytHR](https://www.greythr.com)

**Installation**
```
git clone https://github.com/z0h4n/itc-greythr-cli.git
cd itc-greythr-cli
npm install
```

**Usage**
```
npm start
```

**Config**
```
{
  "origin": "<Your company's origin>", 
  "username": "<Your login username>", // Optional
  "password": "<Your login password>", // Optional
  "sessions": [
    {
      "name": "<Session name>",
      "time": <Session time in milliseconds>
    },
    {
      "name": "<Session name>",
      "time": <Session time in milliseconds>
    },
    ...
  ] // Optional
}
```
**Example**

<image src="./example.gif">
