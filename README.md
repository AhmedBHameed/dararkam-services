# DARARKAM-SERVICES

COVID situation controlling of Friday praying by check in/out and check for space reservation.

# INSTALLATION

- First install `docker & docker-composer`.
- Run `sudo docker-compose -f docker-compose.yml up` to install docker image and all dependencies.
- Use `sudo docker-compose down` to shutdown the system.
- Run `./show-containers-ips.sh` to see what is `nginx` container ip.
- Nginx will listen to the port `9000`.

All services required to be run under container in order to bind with other services and database.

# Documentation

> GET /api/all-prayers

```json
{
  "data": [
    {
      "name": {"first": "Ahmed", "last": "HAMEED"},
      "phone": "07702636251",
      "token": "123",
      "createdAt": "2020-06-01T20:56:01.211Z",
      "updatedAt": "2020-06-01T21:19:56.015Z",
      "reservePrayingTime": "13:30",
      "id": "5ed56b619a02b38e6a23c5fd"
    },
    {
      "name": {"first": "Ahmed", "last": "HAMEED"},
      "reservePrayingTime": "11:30",
      "phone": "0770",
      "token": "01E9S32CVHB456DGM7492P9M32.01E9S32CVH0NE9TMTWKJWPNV9P.01E9S32CVJ2NC5ETVMS18EY3M4",
      "createdAt": "2020-06-01T23:22:40.827Z",
      "updatedAt": "2020-06-01T23:31:23.589Z",
      "id": "5ed58dc0f2d6c4b1fbd2fcb0"
    }
  ]
}
```

> GET api/friday-praying

**Return:**

```json
{
  "data": {
    "settings": {
      "nextFridayData": "2020-06-05", // Calculated automatically till Friday 2 pm. After that a new date calculated.
      "firstPraying": {
        "time": "11:30", // HH:mm
        "personSpaceLeft": 59 // This number decrement with each record on next fetch.
      },
      "secondPraying": {
        "time": "13:30", // HH:mm
        "personSpaceLeft": 59
      }
    },
    "prayer": {
      "token": "01E9S1Y0PBHN7YNJ3B2A61D314.01E9S1Y0PBYPWVPVFNBG7XEZGD.01E9S1Y0PBNGY3K69WAFF3JCYK", // unique token.
      "name": {
        "first": "",
        "last": ""
      },
      "phoneNumber": ""
    }
  }
}
```

> POST api/friday-praying
> This end-point used when the user wants to check how many places left. Note that the user must already exists in the database to get information.

**Payload:**

```json
{
  "token": "01E9S03J6YHSEK94HM354XV1AH.01E9S03J6Y61YMNDGGAWPNXV0Y.01E9S03J6YE45R1TVV7TMHVTHW" // REQUIRED
}
```

**Return:**

```json
{
  "data": {
    "settings": {
      "nextFridayData": "2020-06-05",
      "firstPraying": {
        "time": "11:30", // HH:mm
        "personSpaceLeft": 59
      },
      "secondPraying": {
        "time": "13:30", // HH:mm
        "personSpaceLeft": 59
      }
    },
    "prayer": {
      "name": {
        "first": "Ahmed",
        "last": "HAMEED"
      },
      "reservePrayingTime": "11:30",
      "phone": "07702636251",
      "token": "01E9S03J6YHSEK94HM354XV1AH.01E9S03J6Y61YMNDGGAWPNXV0Y.01E9S03J6YE45R1TVV7TMHVTHW",
      "createdAt": "2020-06-01T22:32:53.019Z",
      "updatedAt": "2020-06-01T22:36:09.855Z",
      "id": "5ed58215adb9a7aa9d49f693"
    }
  }
}
```

**Error**

```json
{
  "data": null,
  "errors": [
    {
      "code": "InvalidReceivedData",
      "error": "\"token\" is not allowed to be empty"
    }
  ]
}
```

> POST api/create-prayer

**Payload:**

```json
{
  "phone": "07702636262", // string REQUIRED
  "firstName": "Ahmed", // string REQUIRED
  "lastName": "HAMEED", // string REQUIRED
  "reservePrayingTime": "11:30", // enum ['11:30', '13:30'] REQUIRED
  "token": "01E9S32CVHB456DGM7492P9M32.01E9S32CVH0NE9TMTWKJWPNV9P.01E9S32CVJ2NC5ETVMS18EY3M4" // Incoming token. REQUIRED
}
```

**Return**

```json
{
  "data": {
    "name": {
      "last": "HAMEED",
      "first": "Ahmed"
    },
    "reservePrayingTime": "11:30",
    "phone": "07702636262",
    "token": "01E9S32CVHB456DGM7492P9M32.01E9S32CVH0NE9TMTWKJWPNV9P.01E9S32CVJ2NC5ETVMS18EY3M4",
    "createdAt": "2020-06-01T23:22:40.827Z",
    "updatedAt": "2020-06-01T23:22:40.835Z",
    "id": "5ed58dc0f2d6c4b1fbd2fcb0"
  }
}
```

> POST api/update-prayer

**Payload:**

```json
{
  "firstName": "Wasim",
  "lastName": "Almadfaa",
  "phone": "123456789",
  "token": "01E9S3YJD4MAFGK1D4RVD5ZNR0.01E9S3YJD49TQ8208HENJYDKCK.01E9S3YJD5KCNK6TMG71QN53RZ",
  "reservePrayingTime": "11:30" // or '' in case of inactive prayer. Taking enum type of ['', '11:30', '13:30']
}
```

**Return**

```json
{
  "data": {
    "name": {
      "first": "Wasim",
      "last": "Almadfaa"
    },
    "reservePrayingTime": "11:30", // or '' in case of inactive prayer
    "phone": "123456789",
    "createdAt": "2020-06-01T23:37:43.036Z",
    "updatedAt": "2020-06-01T23:38:39.994Z",
    "id": "5ed59147572dd2b6c39f690f"
  }
}
```

> DELETE api/delete-prayer/:token => Example api/delete-prayer/01E9S03J6YHSEK94HM354XV1AH.01E9S03J6Y61YMNDGGAWPNXV0Y.01E9S03J6YE45R1TVV7TMHVTHW

**Return**

```json
{
  "data": {
    "message": "Record has been deleted successfully."
  }
}
```

if double click on the same id then error will triggered

**Error**

```json
{
  "data": null,
  "errors": [
    {
      "code": "InvalidDeleteTokenOrNotFound",
      "message": "Invalid delete token or not found record!"
    }
  ]
}
```
