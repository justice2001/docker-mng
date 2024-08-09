# 如何进行容器的自我升级 WIP

众所周知，Docker 容器可以通过映射sock的方法来管理其他容器，也可以升级其他容器。但唯独不能升级自己，因为再升级自己的过程中需要将正在运行的容器删除，再重新创建启动。
但是，容器在删除后就没有了执行命令的能力，重建容器的步骤也就进行不下去了，为了解决这个问题，我想出了一种方案。

那就是，建立一个新的升级工具来升级本容器。通过一条命令完成容器的自我升级过程，升级仅需要拉起这个镜像并对要升级的容器进行升级即可。

命令如下：

```shell
docker run -it --rm \
 --name=selfupdate \
 -v /var/run/docker.sock:/var/run/docker.sock \
 -v /opt/stacks/dm-panel:/opt/stacks/dm-panel \
 -e STACK_PATH=/opt/stacks/dm-panel \
 -e MODE=compose \
 zhengyi59/software-update:latest
```

## 环境变量：

| 变量名        | 描述        | 默认值     | 备注                    |
|------------|-----------|---------|-----------------------|
| MODE       | 升级模式      | compose | 可选值：compose、container |
| STACK_PATH | 升级的容器所在目录 |         | 仅在 MODE=stack 时有效     |
| CONTAINER  | 升级的容器名称   |         | 仅在 MODE=container 时有效 |
| IMAGE      | 升级的镜像名称   |         | 仅需 MODE=container 时有效 |
| CMD        | 升级的容器命令   |         | 仅需 MODE=container 时有效 |

## 需要映射的文件：

| 文件名                  | 描述         | 备注       |
|----------------------|------------|----------|
| /var/run/docker.sock | 容器管理sock   |          |
| /opt/stacks/dm-panel | 升级的堆栈 所在目录 | 需要内外目录一致 |