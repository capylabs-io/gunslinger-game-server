class PlayerPosition {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }
}

class Player {
  position: PlayerPosition;
  health: number;
  speed: number;

  constructor(position: PlayerPosition, health: number, speed: number) {
    this.position = position;
    this.health = health;
    this.speed = speed;
  }
}
