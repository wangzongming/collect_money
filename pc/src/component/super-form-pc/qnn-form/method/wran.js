const wran = function(){
    console.assert(this.props.form, 'form对象必传  来自：qnn-form警告');
    console.assert(this.props.match, '路由信息match属性为必传  来自：qnn-form警告');
    console.assert(this.props.formConfig, 'formConfig属性为必传  来自：qnn-form警告');
    console.assert(this.props.fetch, 'fetch属性为必传  来自：qnn-form警告');
    console.assert(this.props.match, 'match属性为必传  qnn-form警告');

}
export default wran;