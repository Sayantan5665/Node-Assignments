class dashboardController {
    async dashboardView(req, res) {
        console.log("req.user: ", req.user);
        res.render('dashboard', {
            title: 'Dashboard',
            data: {
                url: req.url,
                user: req.user
            },
            messages: req.flash('message')
        });
    }
}

module.exports = new dashboardController();