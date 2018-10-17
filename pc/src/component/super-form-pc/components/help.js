const help = function (version) {
    if (this.props.help) {
        console.log(`
        帮助文档${version}

        
    `, 'color:green')
    }

}

export default help;