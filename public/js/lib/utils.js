function randomIntFromInterval(min,max) // min and max included
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function setSantaWeapon(weaponIndex, animName)
{
    if (typeof weaponIndex != 'undefined')
        game.santa.weapon = game.weapon[weaponIndex];
    if (typeof animName != 'undefined')
        game.santa.renderable.setCurrentAnimation(animName);
}