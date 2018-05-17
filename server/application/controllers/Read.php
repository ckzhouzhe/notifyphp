<?php
defined('BASEPATH') OR exit('No direct script access allowed');

use \QCloud_WeApp_SDK\Auth\LoginService as LoginService;
use QCloud_WeApp_SDK\Constants as Constants;
use QCloud_WeApp_SDK\Mysql\Mysql as DB;
use \QCloud_WeApp_SDK\Helper\Request as Request;

class Read extends CI_Controller {
    public function index() {
        $result = LoginService::check();

        if ($result['loginState'] === Constants::S_AUTH) {
            $this->json([
                'code' => 0,
                'data' => $result['userinfo']
            ]);
        } else {
            $this->json([
                'code' => -1,
                'data' => []
            ]);
        }
    }
    public function getcourse() {
        // echo "string";
        $data=DB::select('readcourse', ['*'], '');
        // var_dump(json_encode($data));
        $this->json($data);
    }
    public function getcourseinfo() {
        // echo "string";
        $data=$this->input->get();
        $res['courseinfo']=DB::select('readcourse', ['*'], ['id' => $data['cs_id']]);
        $replayinfo=DB::select('readread', ['*'], ['cs_id' => $data['cs_id']],'','ORDER BY id DESC LIMIT 20');
        $res['replayinfo']=$replayinfo;
        // var_dump($res['replayinfo']);
        // var_dump($res['replayinfo']->toArray());die();
        foreach ($replayinfo as $key => $value) {

            
            if ($value->imgs) {
                $value->imgs=(object)explode(',', $value->imgs);
            }
            
            if ($value->openid) {
                $temp=DB::row('cSessionInfo', ['*'], ['open_id' => $value->openid]);
                // $temp=json_decode($temp, true);
                if ($temp) {
                    // $userinfo=(object)$temp->user_info;
                    $value->userinfo=$temp;
                }
                
            }
            
            $value->create_time=substr($value->create_time, 0,10);
            $replayinfo[$key] = $value;
            
        }
        // var_dump(json_encode($data));

        $this->json($res);
    }
    public function putread()
    {
        
        $data=$this->input->get();
        if (!$data['openId']) {
            $data['openid']=123;
        }
        if (!$data['imgs']) {
            $data['imgs']='';
        }
        // var_dump($data['imgs']);
        // var_dump(eval($data['imgs']));


        // // var_dump(implode(',', $data['imgs']));
        // die();


        $res = DB::insert('readread', $data);
        if ($res) {
            $this->json([
                'code' => 1,
                'data' => $res
            ]);
        }else{
            $this->json([
                'code' => 0,
                'data' => []
            ]);
        }
    }
}
