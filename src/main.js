const express = require('express')
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')

const cors = require('cors')

const bodyParser = require('body-parser')

const app = express()
const port = 3001

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

const data = require("./example.json");

app.get('/', (req, res) => {
  res.json(data)
})

app.post('/save', jsonParser, (req, res) => {
  req.body.forEach(element => {
    console.log(element)
  });
  res.send('Resopnse from Backend')
})

app.use(Sentry.Handlers.errorHandler());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})