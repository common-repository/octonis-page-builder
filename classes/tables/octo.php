<?php
class tableOctoOct extends tableOct {
    public function __construct() {
        $this->_table = '@__octo';
        $this->_id = 'id';     /*Let's associate it with posts*/
        $this->_alias = 'sup_octo';
        $this->_addField('pid', 'text', 'int')
             ->_addField('active', 'checkbox', 'tinyint')
            ->_addField('unique_id', 'text', 'text')
            ->_addField('params', 'text', 'text')
            ->_addField('label', 'text', 'text')
            ->_addField('original_id', 'text', 'int')
            ->_addField('img', 'text', 'text')
            ->_addField('sort_order', 'text', 'int')
            ->_addField('is_base', 'text', 'int')
            ->_addField('date_created', 'text', 'datetime')
            ->_addField('is_pro', 'text', 'int');
    }
}