/* Changes since part 5:

  1. Simplified Class constructors by removing multiple prefixes: For example:
     Game.World.Object.Player is now Game.Player.
  2. Added Game.World.prototype.setup to setup world from json level data.
  3. Added the Game.MovingObject calss to separate Objects from MovingObjects.
     Game.Player now inherits from MovingObject instead of Object.
  4. Changed Game.World.map to Game.World.graphical_map.
  5. Made the Game.Collider.collideObject routing function do all y first collision checks.
     This simply means that I check collision on top and bottom before left and right. 
  6. Removed world boudary collision from World.collideObject so the player can
     move off screen enough to hit a door. 
  7. Added the Game.Door class.
  8. Added functions to get the center position of Game.Object and Game.MovingObject.
  9. Organized classes by alphabeticalish order.
  10. Put a limit on plyaer velocity because there was a problem with "tunneling"
      through tiles due to jump movement speed. 
  11. Changed the player's hitbox size and his frame offsets for animation.

*/

const Game = function() {

    this.world  = new Game.World();

    this.update = function() {

        this.world.update();

    };

};
Game.prototype = { constructor : Game };

Game.Animator = function(frame_set, delay) {

    this.count       = 0;
    this.delay       = (delay >= 1) ? delay : 1;
    this.frame_set   = frame_set;
    this.frame_index = 0;
    this.frame_value = frame_set[0];
    this.mode        = "pause";

};
Game.Animator.prototype = {

    constructor:Game.Animator, 

    animate:function() {

        switch(this.mode) {

            case "loop" : this.loop(); break;
            case "pause":              break;

        }

    },

    changeFrameSet(frame_set, mode, delay = 10, frame_index = 0) {

        if (this.frame_set === frame_set) { return; }

        this.count       = 0;
        this.delay       = delay;
        this.frame_set   = frame_set;
        this.frame_index = frame_index;
        this.frame_value = frame_set[frame_index];
        this.mode        = mode;

    },

    loop:function() {

        while(this.count > this.delay) {

            this.count -= this.delay;
            
            this.frame_index = (this.frame_index < this.frame_set.length -1) ? this.frame_index + 1 : 0;

            this.frame_value = this.frame_set[this.frame_index];

        }

    }

};

Game.Collider = function() {

    /* I changed this so all the checks happen y first order. */
    this.collide = function(value, object, tile_x, tile_y, tile_size) {

        switch(value) {

            case  1:     this.collidePlatformTop    (object, tile_y            ); break;
            case  2:     this.collidePlatformRight  (object, tile_x + tile_size); break;
            case  3: if (this.collidePlatformTop    (object, tile_y            )) return;
                         this.collidePlatformRight  (object, tile_x + tile_size); break;
            case  4:     this.collidePlatformBottom (object, tile_y + tile_size); break;
            case  5: if (this.collidePlatformTop    (object, tile_y            )) return;
                         this.collidePlatformBottom (object, tile_y + tile_size); break;
            case  6: if (this.collidePlatformRight  (object, tile_x + tile_size)) return;
                         this.collidePlatformBottom (object, tile_y + tile_size); break;
            case  7: if (this.collidePlatformTop    (object, tile_y            )) return;
                     if (this.collidePlatformBottom (object, tile_y + tile_size)) return;
                         this.collidePlatformRight  (object, tile_x + tile_size); break;
            case  8:     this.collidePlatformLeft   (object, tile_x            ); break;
            case  9: if (this.collidePlatformTop    (object, tile_y            )) return;
                         this.collidePlatformLeft   (object, tile_x            ); break;
            case 10: if (this.collidePlatformLeft   (object, tile_x            )) return;
                         this.collidePlatformRight  (object, tile_x + tile_size); break;
            case 11: if (this.collidePlatformTop    (object, tile_y            )) return;
                     if (this.collidePlatformLeft   (object, tile_x            )) return;
                         this.collidePlatformRight  (object, tile_x + tile_size); break;
            case 12: if (this.collidePlatformBottom (object, tile_y + tile_size)) return;
                         this.collidePlatformLeft   (object, tile_x            ); break;
            case 13: if (this.collidePlatformTop    (object, tile_y            )) return;
                     if (this.collidePlatformBottom (object, tile_y + tile_size)) return;
                         this.collidePlatformLeft   (object, tile_x            ); break;
            case 14: if (this.collidePlatformBottom (object, tile_y + tile_size)) return;
                     if (this.collidePlatformLeft   (object, tile_x            )) return;
                         this.collidePlatformRight  (object, tile_x + tile_size); break;
            case 15: if (this.collidePlatformTop    (object, tile_y            )) return;
                     if (this.collidePlatformBottom (object, tile_y + tile_size)) return;
                     if (this.collidePlatformLeft   (object, tile_x            )) return;
                        this.collidePlatformRight  (object, tile_x + tile_size); break;
        }
    }
}