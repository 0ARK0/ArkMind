package com.ark.arkmind.po.page;

public class PageRequest {
    private int pageNum;//当前页码
    private int pageSize;//每页数量

    public int getPageNum() {
        return pageNum;
    }
    public void setPageNum(int pageNum) {
        this.pageNum = pageNum;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }
}
