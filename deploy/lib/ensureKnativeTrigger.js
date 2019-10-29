'use strict'

const { Context } = require('@serverless/core')
const KnativeEventing = require('@serverless/knative-eventing')
const { getNamespace, getFuncName } = require('../../shared/utils')

function ensureKnativeTrigger(funcName, eventName, eventConfig) {
  const { filter } = eventConfig
  const { service } = this.serverless.service
  const stage = this.provider.getStage()

  const ctx = new Context()
  const eventing = new KnativeEventing(undefined, ctx)

  const sinkName = getFuncName(service, funcName)
  const namespace = getNamespace(service, stage)

  const inputs = {
    // TODO: this should be unique since we can have multiple such event definitions
    name: `${sinkName}-event-${eventName}`,
    sink: {
      name: sinkName
    },
    filter,
    namespace
  }

  this.serverless.cli.log(`Deploying Knative trigger "${inputs.name}"...`)

  return eventing.default(inputs)
}

module.exports = ensureKnativeTrigger
