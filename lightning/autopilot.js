/**
 * @fileOverview actions related to autopilot, such as toggling
 * whether autopilot should open channels.
 */

import { ATPL_DELAY } from './config';
import { poll, checkHttpStatus } from './helpers';

class AtplAction {
  constructor(grpc) {
    this._grpc = grpc;
  }

  /**
   * Initialize autopilot from the stored settings and enable it via grpc
   * depending on if the user has enabled it in the last session. Fetch node
   * scores are fetched from an api to inform channel selection.
   * @return {Promise<undefined>}
   */
  async init() {
    await this.updateNodeScores();
    await this._setStatus(true);
    await poll(() => this.updateNodeScores(), ATPL_DELAY);
  }

  /**
   * Set whether autopilot is enabled or disabled.
   * @param {boolean} enable      Whether autopilot should be enabled.
   * @return {Promise<undefined>}
   */
  async _setStatus(enable) {
    try {
      await this._grpc.sendAutopilotCommand('modifyStatus', { enable });
      return true;
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Update node scores to get better channels via autopilot.
   * @return {Promise<undefined>}
   */
  async updateNodeScores() {
    try {
      //await this._checkNetwork();
      const scores = await this._readNodeScores();
      return await this._setNodeScores(scores);
    } catch (e) {
      console.log('Updating autopilot scores failed');
      console.log(e);
    }
  }

  async _readNodeScores() {
    try {
      const network = "testnet";
      return await this._fetchNodeScores(network);
    } catch (e) {
      console.log('Fetching node scores failed');
      console.log(e);
    }
  }

  async _fetchNodeScores(network) {
    const baseUri = 'https://nodes.lightning.computer/availability/v1';
    const uri = `${baseUri}/btc${network === 'testnet' ? 'testnet' : ''}.json`;
    const response = checkHttpStatus(await fetch(uri));
    return this._formatNodesScores((await response.json()).scores);
  }

  _formatNodesScores(jsonScores) {
    //console.log(jsonScores);
    return jsonScores.reduce((map, { public_key, score }) => {
      if (typeof public_key !== 'string' || !Number.isInteger(score)) {
        throw new Error('Invalid node score format!');
      }
      map[public_key] = score / 100000000.0;
      return map;
    }, {});
  }

  async _setNodeScores(scores) {
    if (!scores) {
      throw new Error('Node scores are emtpy');
    }
    return await this._grpc.sendAutopilotCommand('setScores', {
      heuristic: 'externalscore',
      scores,
    });
  }
}

export default AtplAction;
