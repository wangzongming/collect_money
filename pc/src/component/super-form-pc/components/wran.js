const wran = function(){
    console.assert(this.props.formConfig, 'formConfig属性为必传  来自：qnn-table警告');
    console.assert(this.props.history, 'history属性为必传  qnn-table警告');
    console.assert(this.props.match, 'match属性为必传  qnn-table警告');
    console.assert(this.props.fetch, 'fetch属性为必传  来自：qnn-table警告');
}
export default wran;