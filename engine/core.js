/**
 * Caves Engine
 * @copyright   Bill Robitske, Jr. 2018
 * @author      Bill Robitske, Jr. <bill.robitske.jr@gmail.com>
 * @license     MIT
 */

import GameEntity from './game-entity.js';
import Collection from './collection.js';
import PlayerEntity from './player-entity.js';
import LocationEntity from './location-entity.js';

const DEBUG = true;

const STATE_MENU = 0;
const STATE_OPENING = 1;
const STATE_GAME = 2;
const STATE_ENDING = 3;
const STATE_LOADING = 4;
const STATE_SAVING = 5;

/**
 * Caves Engine core class
 */
export default class CavesEngine {

  /**
   * Create a new game instance
   * @param {*} outputs - Available output screens
   * @param {*} config - Game entity configurations
   */
  constructor(outputs, config) {
    this._outputs = outputs;
    this._config = config || {
      game: config.game || {},
      player: config.player || {},
      locations: config.locations || [],
      objects: config.objects || []
    };
    this._state = STATE_MENU;
    this._gameEntity = new GameEntity(this._config.game);
    this._inputHandlers = [
      this.handleMenuInput,
      this.handleOpeningInput,
      this.handleGameInput,
      this.handleEndingInput,
      this.handleLoadingInput,
      this.handleSavingInput
    ];

    this.displayMenu();
  }

  get handleInput() { return this._inputHandlers[this._state].bind(this); }

  startOpening() {
    this._state = STATE_OPENING;
    this._gameEntity.resetOpening();
    this.displayOpening();
  }

  startGame() {
    this._state = STATE_GAME;
    this._gameEntity.player = new PlayerEntity(this._config.player, this._gameEntity);
    this._gameEntity.locations = new Collection(this._config.locations.map(config => new LocationEntity(config, this._gameEntity)));
    this._outputs.main.clear();
    this.displayGameTurnStart();
  }

  handleMenuInput(input = "") {
    if (DEBUG) console.log(`CavesEngine#handleMenuInput("${input}")`);
    if (input.match(/start/i)) {
      this.startOpening();
    } else if (input.match(/load/i)) {
      this._state = STATE_LOADING;
    } else {
      this.displayMenu();
    }
  }

  handleOpeningInput(input) {
    if (DEBUG) console.log(`CavesEngine#handleOpeningInput("${input}")`);
    const openingComplete = this._gameEntity.advanceOpening();
    if (openingComplete) {
      this.startGame();
    } else {
      this.displayOpening();
    }
  }

  handleGameInput(input) {
    if (DEBUG) console.log(`CavesEngine#handleGameInput("${input}")`);
  }

  handleEndingInput(input) {
    if (DEBUG) console.log(`CavesEngine#handleEndingInput("${input}")`);
  }

  handleLoadingInput(input) {
    if (DEBUG) console.log(`CavesEngine#handleLoadingInput("${input}")`);
  }

  handleSavingInput(input) {
    if (DEBUG) console.log(`CavesEngine#handleSavingInput("${input}")`);
  }

  displayMenu() {
    const menu = this._gameEntity.menuScreen;
    this._outputs.main.clear();
    menu.forEach(line => {
      this._outputs.main.print(line);
    });
  }

  displayOpening() {
    const opening = this._gameEntity.openingScreen;
    this._outputs.main.clear();
    opening.forEach(line => {
      this._outputs.main.print(line);
    });
    this._outputs.main.print(`Press Return to continue...`);
  }

  displayGameTurnStart() {
    this._outputs.location.clear();
    this._outputs.location.print(this._gameEntity.locationScreen);
    this._outputs.player.clear();
    this._outputs.player.print(this._gameEntity.playerScreen);
  }
}
