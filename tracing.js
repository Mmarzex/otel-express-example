const opentelemtry = require('@opentelemetry/sdk-node')
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node')
// const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");
const { ZipkinExporter } = require("@opentelemetry/exporter-zipkin");
const { BasicTracerProvider, SimpleSpanProcessor, ConsoleSpanExporter } = require("@opentelemetry/sdk-trace-base");
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { AwsInstrumentation } = require('@opentelemetry/instrumentation-aws-sdk')
const provider = new BasicTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'express-otel-test',
  })
})
// const exporter = new JaegerExporter({
//   endpoint: 'http://localhost:14268/api/traces',

// });

const exporter = new ZipkinExporter();

provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

provider.register()
const sdk = new opentelemtry.NodeSDK({
  // traceExporter: new opentelemtry.tracing.ConsoleSpanExporter(),
  instrumentations: [getNodeAutoInstrumentations(), new AwsInstrumentation()],
  spanProcessor: provider,
})


sdk.start()
