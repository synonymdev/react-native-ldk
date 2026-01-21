# RPC-Driven E2E Tests

## Overview

The `ldk-rpc.e2e.js` file contains **RPC-driven E2E tests** that test LDK functionality using direct API calls instead of UI interactions. This means **tests can run immediately without any UI implementation**.

## Key Advantages

### ✅ No UI Required
- Tests use `lm` (lightning manager) and `ldk` module APIs directly
- No need to build UI screens, buttons, or input fields
- Tests work with the existing example app as-is

### ✅ Fast Execution
- Direct API calls are much faster than UI interactions
- No waiting for animations, screen transitions, or renders
- Tests complete in seconds instead of minutes

### ✅ More Reliable
- No flaky UI timing issues
- Direct assertions on internal state
- Clearer error messages when tests fail

### ✅ Better Coverage
- Can test edge cases that are hard to trigger via UI
- Direct access to all LDK APIs
- Can verify internal state that UI might not expose

## Test Structure

### Test Suites

1. **LDK RPC - Initialization**
   - ✅ Start LDK with minimal configuration
   - ✅ Get LDK version information
   - **No UI needed** - Uses `lm.start()` and `ldk.version()`

2. **LDK RPC - Channel Operations**
   - ✅ Add LND as peer via `lm.addPeer()`
   - ✅ Open channel from LND to LDK
   - ✅ List open channels via `ldk.listChannels()`
   - **No UI needed** - Uses LDK APIs and LND RPC

3. **LDK RPC - Payment Operations**
   - ✅ Create invoices via `lm.createAndStorePaymentRequest()`
   - ✅ Receive payments from LND
   - ✅ Send payments to LND via `lm.payWithTimeout()`
   - ✅ Handle zero-amount invoices
   - **No UI needed** - Uses LDK payment APIs

4. **LDK RPC - Event Handling**
   - ✅ Subscribe to events via `ldk.onEvent()`
   - **No UI needed** - Tests event system directly

5. **LDK RPC - Cleanup**
   - ✅ Close channels via `ldk.closeChannel()`
   - ✅ Stop LDK via `ldk.stop()`
   - **No UI needed** - Uses cleanup APIs

## Running RPC-Driven Tests

### Prerequisites

1. **Start Docker environment:**
   ```bash
   cd example/docker
   docker compose up
   ```

2. **Build the app:**
   ```bash
   cd example
   yarn e2e:build:ios-debug
   # or
   yarn e2e:build:android-debug
   ```

### Run Tests

```bash
# Run all RPC tests
yarn e2e:test:rpc

# Or use specific configuration
detox test -c ios.sim.debug e2e/ldk-rpc.e2e.js
detox test -c android.emu.debug e2e/ldk-rpc.e2e.js
```

### Expected Output

```
LDK RPC - Initialization
  ✓ should start LDK with minimal configuration
  ✓ should return LDK version information

LDK RPC - Channel Operations
  ✓ should add LND as peer
  ✓ should open channel from LND to LDK
  ✓ should list open channels

LDK RPC - Payment Operations
  ✓ should create Lightning invoice
  ✓ should receive payment from LND
  ✓ should send payment to LND
  ✓ should handle zero-amount invoice

LDK RPC - Event Handling
  ✓ should emit and handle events

LDK RPC - Cleanup
  ✓ should close channels cooperatively
  ✓ should stop LDK cleanly
```

## Comparison: RPC-Driven vs UI-Driven

### RPC-Driven (ldk-rpc.e2e.js)

```javascript
// Direct API call
const invoiceResult = await lm.createAndStorePaymentRequest({
  amountSats: 1000,
  description: 'Test payment',
  expiryDeltaSeconds: 3600,
});

expect(invoiceResult.isOk()).toBe(true);
expect(invoiceResult.value.to_str).toMatch(/^lnbcrt/);
```

**✅ Works now** - No UI required
**✅ Fast** - Milliseconds to execute
**✅ Clear** - Direct assertion on result

### UI-Driven (payments.e2e.js)

```javascript
// UI interaction required
await element(by.id('receiveTab')).tap();
await typeText('amountInput', '1000');
await typeText('descriptionInput', 'Test payment');
await element(by.id('generateInvoiceButton')).tap();

await waitForText('Invoice Created');
const invoice = await element(by.id('invoiceText')).getAttributes();
expect(invoice.text).toMatch(/^lnbcrt/);
```

**⊘ Requires UI** - Buttons, inputs, screens must be implemented first
**⊘ Slower** - Seconds to execute (animations, renders)
**⊘ Brittle** - Can break if UI changes

## How RPC Tests Work

### 1. Import LDK Modules

```javascript
const ldkModule = require('@synonymdev/react-native-ldk');
const lm = ldkModule.default;      // Lightning Manager
const ldk = ldkModule.ldk;         // LDK low-level API
const EEventTypes = ldkModule.EEventTypes;
const ENetworks = ldkModule.ENetworks;
```

### 2. Use LDK APIs Directly

```javascript
// Start LDK
await lm.start({ account, getBestBlock, getAddress, ... });

// Sync to chain
await lm.syncLdk();

// Get node ID
const nodeId = await ldk.nodeId();

// Add peer
await lm.addPeer({ pubKey, address, port });

// Create invoice
await lm.createAndStorePaymentRequest({ amountSats, description });

// Pay invoice
await lm.payWithTimeout({ paymentRequest, timeout });

// List channels
await ldk.listChannels();

// Close channel
await ldk.closeChannel({ channelId, counterPartyNodeId });

// Stop LDK
await ldk.stop();
```

### 3. Use RPC Clients for External Nodes

```javascript
// Bitcoin Core RPC
const bitcoin = new BitcoinRPC('http://user:pass@localhost:18443');
await bitcoin.getBlockCount();
await bitcoin.generateToAddress(6, address);

// LND RPC
const lnd = new LNDRPC('localhost', 8080, macaroon);
const info = await lnd.getInfo();
await lnd.openChannelSync({ node_pubkey_string, local_funding_amount });
await lnd.sendPaymentSync({ payment_request });
```

### 4. Assert on Results

```javascript
// Check result is ok
expect(result.isOk()).toBe(true);

// Check values
expect(channels.length).toBeGreaterThan(0);
expect(channel.is_usable).toBe(true);
expect(payment.state).toBe('successful');
```

## Integration with Existing Mocha Tests

The RPC-driven E2E tests follow the same patterns as the existing mocha tests in `example/tests/lnd.ts`, but use Detox/Jest instead of Mocha:

### Similarities

- Both use `lm` and `ldk` APIs directly
- Both use RPC clients for Bitcoin and Lightning nodes
- Both test the same flows (peer connection, channel opening, payments)
- Both make assertions on internal state

### Differences

- **Test Runner**: Detox/Jest vs Mocha
- **Environment**: Runs in app context vs browser
- **Organization**: Feature-based test suites vs single large test
- **Assertions**: Jest `expect()` vs Chai `expect()`

## Benefits for Development

### 1. **Test-Driven Development**
Write RPC tests first, then implement UI later:
```
1. Write RPC test for feature
2. Run test - it passes (API works)
3. Implement UI when ready
4. Write UI test if needed
```

### 2. **Faster Iteration**
- No need to rebuild app for each test change
- No need to navigate through UI manually
- Faster feedback loop

### 3. **Better Debugging**
- Direct access to error messages
- Can add logging at any point
- Can inspect state between steps

### 4. **Regression Testing**
- Quickly verify LDK functionality after updates
- Catch API-breaking changes immediately
- Ensure compatibility with Lightning network

## When to Use Which Approach

### Use RPC-Driven Tests For:
- ✅ Core LDK functionality (channels, payments, sync)
- ✅ API correctness and behavior
- ✅ Lightning Network protocol compliance
- ✅ Error handling and edge cases
- ✅ Regression testing after LDK upgrades

### Use UI-Driven Tests For:
- 📱 User experience flows
- 📱 Screen navigation
- 📱 Input validation
- 📱 Visual elements
- 📱 Accessibility features

## Best Practices

### 1. **Keep Tests Independent**
Each test should be able to run in isolation:
```javascript
beforeEach(async () => {
  // Clean state
  await ldk.stop();
  await wipeLdkStorage();
  // Start fresh
  await lm.start({ ... });
});
```

### 2. **Use Helpers for Common Operations**
Extract reusable patterns:
```javascript
const { mineBlocks, fundAddress, waitForChannel } = require('./helpers');

await fundAddress(bitcoin, address, 1);
await mineBlocks(bitcoin, 6);
```

### 3. **Add Descriptive Logging**
Help debug failures:
```javascript
console.log(`✓ Channel opened: ${channelId}`);
console.log(`✓ Payment sent: ${paymentHash}`);
```

### 4. **Handle Async Properly**
Use proper wait conditions:
```javascript
// ✅ Good - wait for actual condition
let channelActive = false;
for (let i = 0; i < 30 && !channelActive; i++) {
  const channels = await ldk.listChannels();
  if (channels.value[0]?.is_usable) {
    channelActive = true;
  }
  await sleep(1000);
}

// ❌ Bad - arbitrary sleep
await sleep(10000);
```

## Future Enhancements

Potential additions to RPC-driven tests:

1. **Multi-hop payments** - Test routing through multiple nodes
2. **Channel closure scenarios** - Force close, breach, timeout
3. **Backup and restore** - Test state persistence
4. **Network graph** - Test routing and pathfinding
5. **HTLC handling** - Test payment atomicity
6. **Fee management** - Test dynamic fee estimation

## Summary

RPC-driven E2E tests provide:
- ✅ **Immediate usability** - Run now without UI
- ✅ **Fast execution** - Complete test suite in seconds
- ✅ **Comprehensive coverage** - All LDK functionality
- ✅ **Easy maintenance** - Clear, simple code
- ✅ **Better debugging** - Direct error messages

Start with RPC tests, add UI tests later as needed!
