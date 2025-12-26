export const Utils = {
   // for a11y
   onKeyDown: function (e) {
     if (e.key == 'Enter' || e.key == 'Space') {
       e.target.click();
     }
   }
};
