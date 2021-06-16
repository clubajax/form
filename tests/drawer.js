require('./common');


const text = `<section>
<button class="ui-button" id="btn">Toggle Horizontal</button>
<ui-drawer id="drawer" open="true">
    <div class="drawer-content">
        This content is in the drawer
    </div>
</ui-drawer>
</section>
<section>
<button class="ui-button" id="btn2">Toggle Vertical</button>
<ui-drawer id="drawer2" open="false" vertical="true">
    <div class="drawer-content two">
        This content is in the drawer
    </div>
</ui-drawer>
</section>`;

dom.byId('tests').innerHTML = text;

const drawer = dom.byId('drawer');
on('btn', 'click', () => {
    drawer.open = !drawer.open;
});

const drawer2 = dom.byId('drawer2');
on('btn2', 'click', () => {
    drawer2.open = !drawer2.open;
});