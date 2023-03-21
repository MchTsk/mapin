<?php 
    //postデータを受け取る
    $ken = $_POST['request'];
    
    //受け取ったデータが空でなければ
    if (!empty($ken)) {
    
        //pdoインスタンス生成
        $pdo = new PDO ('mysql:host=localhost;dbname=local', 'root', 'stm12345');
        //SQL文作成
        // $sql = "select  from local.hotelInfo where prefecture = '".$ken."'";
        $sql = "select id, name, lat, lng, url, userId from local.hotelInfo where delFlg <> 1 limit 1";

        //SQL実行
        $results = $pdo->query($sql);
        //出力ごにょごにょ
        echo '<table class="list_table">';
        echo "<tr>";
        echo "<th>データ</th>";
        echo "</tr>";
        //データベースより取得したデータを一行ずつ表示する
        foreach ($results as $result) {
            echo "<tr>";
            echo "<td>".$result['name']."</td>";
            echo "</tr>";
        }
        echo "</table>";
    
    //空だったら
    } else {
        echo '<p id="tekito">エラー：都道府県を選択して下さい。</p>';
    }
    
?>
