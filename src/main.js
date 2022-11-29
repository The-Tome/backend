const express = require('express')
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')

const cors = require('cors')

const bodyParser = require('body-parser')

const fs = require('fs');

const app = express()
const port = 3001

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// create application/json parser
var jsonParser = bodyParser.json()

Sentry.init({
  dsn: "https://70eaaecafa784be9bda52042320bc8e5@o1365087.ingest.sentry.io/6660472",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.use(cors());

app.get('/', (req, res) => {
  res.sendFile("/workspace/src/example.json")
})

app.post('/user', jsonParser, async (req, res) => {
  let id = req.body.id
  var users = null
  try {
    users = await prisma.users.findFirst({
      where: {
        'firebase_id': id
      },
    })
  } catch (error) {
    console.error(error)
  }
  console.log(users)

  res.send(users)
})

app.post('/getWorlds', jsonParser, async (req, res) => {
  let id = req.body.id
  // let id = 'h23BF9jHAlM44U2cixhMcnGxuFh2'
  var worlds = null
  try {
    worlds = await prisma.users.findMany({
      where: {
        'firebase_id': id
      },
      include: {
        worlds:{
          include: {
            notes: true,
          },
        },        
      },
    })
  } catch (error) {
    console.error(error)
  }
  console.log(worlds)

  res.send(worlds)
})

app.post('/createUser', jsonParser, async (req, res) => {
  let user = req.body
  console.log(user)
  let userReturn = null
  let d = null

  try {
    d = await prisma.users.create({
      data: {
        first_name: user.fName,
        last_name: user.lName,
        email: user.email,
        firebase_id: user.id
      }
    })
  } catch (error) {
    console.error(error)
  }
  
  try {
    userReturn = await prisma.users.findFirst({
      where: {
        'firebase_id': user.id
      },
    })
  } catch (error) {
    console.error(error)
  }

  console.log(userReturn)

  res.send(userReturn)
})

app.post('/save', jsonParser, (req, res) => {
  // console.log(req.body)

  let elements = req.body

  let template = {
      "boards": [
          {
              "boardId": 1,
              "unit": "rem",
              "left": 0,
              "top": 7,
              "width": 50,
              "height": 50,
              "backgroundColor": "#531fc2"
              }
      ],
      "elements": elements
  }

  if (elements.length != 0){
    //console.log(template)
    fs.writeFileSync('src/example.json', JSON.stringify(template, null, 2))
  }

  // req.body.forEach(elm => {
  //   console.log(elm)
  // });
  res.send('Resopnse from Backend')
})

app.use(Sentry.Handlers.errorHandler());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})