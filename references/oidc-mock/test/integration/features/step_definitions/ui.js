/**
  Copyright 2020 Google LLC

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

*/
const {
  Given,
  When,
  Then,
  After
} = require('@cucumber/cucumber')
const puppeteer = require('puppeteer')
const hostname = process.env.TEST_HOST
const state ='abc-7890'
const scope = 'openid email address'
const assert = require('assert')


Given('I navigate to the authorize page', async function() {
  this.browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu"]
  })
  this.page = await this.browser.newPage()
  return await this.page.goto('https://' + hostname + '/v1/openid-connect/authorize?client_id=' + this.apickli.scenarioVariables.clientId
    + '&redirect_uri=https://mocktarget.apigee.net/echo&response_type=code&state=' + state +'&scope=' + scope)
})

Given('I navigate to the authorize page with an invalid response type', async function() {
  this.browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu"]
  })
  this.page = await this.browser.newPage()
  return await this.page.goto('https://' + hostname + '/v1/openid-connect/authorize?client_id=' + this.apickli.scenarioVariables.clientId
    + '&redirect_uri=https://mocktarget.apigee.net/echo&response_type=xxx&state=' + state +'&scope=' + scope)
})

Given('I navigate to the authorize page without a scope parameter', async function() {
  this.browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu"]
  })
  this.page = await this.browser.newPage()
  return await this.page.goto('https://' + hostname + '/v1/openid-connect/authorize?client_id=' + this.apickli.scenarioVariables.clientId
    + '&redirect_uri=https://mocktarget.apigee.net/echo&response_type=code&state=' + state)
})

Given('I navigate to the authorize page without a state parameter', async function() {
  this.browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu"]
  })
  this.page = await this.browser.newPage()
  return await this.page.goto('https://' + hostname + '/v1/openid-connect/authorize?client_id=' + this.apickli.scenarioVariables.clientId
    + '&redirect_uri=https://mocktarget.apigee.net/echo&response_type=code&&scope=' + scope)
})

When('I sign in and consent', async function() {
  // fill in login page
  await this.page.click('#username')
  await this.page.keyboard.type(this.apickli.scenarioVariables.username)
  await this.page.click('#password')
  await this.page.keyboard.type(this.apickli.scenarioVariables.password)

  // submit
  await Promise.all([
    this.page.click('#submit'),
    this.page.waitForNavigation()
  ])

  // return submit
  return await Promise.all([
    this.page.click('#submit'),
    this.page.waitForNavigation()
  ])

})

Then('I am redirected to the Client App', function() {
  assert.notStrictEqual(this.page.url().indexOf('https://mocktarget.apigee.net/echo'), -1);
})

Then('I receive an auth code in a query param',  function() {
  assert.notStrictEqual(this.page.url().indexOf('code='), -1);
})

Then('I store the auth code in global scope', async function() {
  this.apickli.setGlobalVariable('authCode',
    new URL(this.page.url()).searchParams.get('code'))
})

Then('I store the state parameter in global scope', async function() {
  this.apickli.setGlobalVariable('state',state)
})

Then('I receive an unsupported_response_type error', function() {
  assert.notStrictEqual(this.page.url().indexOf('error=unsupported_response_type'), -1);
})

Then('I receive an invalid_request error', function() {
  assert.notStrictEqual(this.page.url().indexOf('error=invalid_request'), -1);
})

After(async function() {
  if (this.browser) this.browser.close()
})
