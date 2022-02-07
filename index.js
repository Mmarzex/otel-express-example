const express = require("express");
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, PutCommand, GetCommand } = require('@aws-sdk/lib-dynamodb')
const PORT = process.env.PORT || "8080";
const app = express();

const tableName = 'instrumentation-test'

// async function start

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get('/ddb', async (req, res) => {
  const client = new DynamoDBClient({ region: 'us-east-1' })
  const docClient = DynamoDBDocumentClient.from(client)

  const now = Date.now()
  const putRes = await docClient.send(new PutCommand({
    TableName: tableName,
    Item: {
      'pk': 'abc123',
      'sk': `${now}`,
      'v': 'test me 123'
    }
  }))

  const getRes = await docClient.send(new GetCommand({
    TableName: tableName,
    Key: {
      'pk': 'abc123',
      'sk': `${now}`,
    }
  }))

  res.send('ddb hello');
})

app.listen(parseInt(PORT, 10), () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});
