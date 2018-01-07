const browserList = [
    'last 3 versions',
    '> 1%'
];

module.exports = {
    plugins: [
        require('autoprefixer')(browserList)
    ]
};
