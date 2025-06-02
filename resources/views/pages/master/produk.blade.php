@extends('layouts.app')
@section('title', 'Produk')
@section('content')
    <div class="page-wrapper">
        <div class="content">
            <div class="page-header">
                <div class="add-item d-flex">
                    <div class="page-title">
                        <h4>DAFTAR PRODUK</h4>
                    </div>
                </div>
                <ul class="table-top-head">
                    </li>
                    <li>
                        <a data-bs-toggle="tooltip" id="refreshButton" data-bs-placement="top" title="Refresh"><i
                                data-feather="rotate-ccw" class="feather-rotate-ccw"></i></a>
                    </li>
                    <li>
                        <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header"><i
                                data-feather="chevron-up" class="feather-chevron-up"></i></a>
                    </li>
                </ul>
                <div class="page-btn">
                    <a class="btn btn-added" id="btnTambahProduk"><i data-feather="plus-circle" class="me-2"></i>TAMBAH
                        PRODUK</a>
                </div>
            </div>

            <div class="card table-list-card">
                <div class="card-body">
                    <div class="table-top">
                        <div class="search-set">
                            <div class="search-input">
                                <a href="javascript:void(0);" class="btn btn-searchset"><i data-feather="search"
                                        class="feather-search"></i></a>
                            </div>
                        </div>
                    </div>

                    <div class="table-responsive product-list">
                        <table id="produkTable" class="table table-hover" style="width: 100%">
                            <thead class="thead-secondary">
                                <tr>
                                    <th>NO.</th>
                                    <th>KODE PRODUK</th>
                                    <th>NAMA</th>
                                    <th>BERAT</th>
                                    <th>KARAT</th>
                                    <th>HARGA / GRAM</th>
                                    <th>STATUS</th>
                                    <th class="no-sort">ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <!-- md Tambah Produk -->
    <div class="modal fade" id="mdTambahProduk">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="page-title">
                        <h4>TAMBAH PRODUK</h4>
                    </div>
                    <button type="button" class="close bg-danger text-white fs-16" data-bs-dismiss="modal"
                        aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form id="formTambahProduk" method="POST" enctype="multipart/form-data">
                    @csrf
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">NAMA<span class="text-danger ms-1">*</span></label>
                            <input type="text" name="nama" class="form-control">
                        </div>
                        <div class="row">
                            <div class="col-6 mb-3">
                                <label class="form-label">JENIS<span class="text-danger ms-1">*</span></label>
                                <select class="select" name="jenis" id="jenisproduk">
                                </select>
                            </div>
                            <div class="col-6 mb-3">
                                <label class="form-label">KONDISI<span class="text-danger ms-1">*</span></label>
                                <select class="select" name="kondisi" id="kondisi">
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-6 mb-3">
                                <label class="form-label">BERAT<span class="text-danger ms-1">*</span></label>
                                <input type="text" name="berat" class="form-control">
                            </div>
                            <div class="col-6 mb-3">
                                <label class="form-label">KARAT<span class="text-danger ms-1">*</span></label>
                                <input type="text" name="karat" class="form-control">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-6 mb-3">
                                <label class="form-label">LINGKAR</label>
                                <input type="text" name="lingkar" class="form-control">
                            </div>
                            <div class="col-6 mb-3">
                                <label class="form-label">PANJANG</label>
                                <input type="text" name="panjang" class="form-control">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-6 mb-3">
                                <label class="form-label">HARGA JUAL</label>
                                <input type="text" name="hargajual" class="form-control">
                            </div>
                            <div class="col-6 mb-3">
                                <label class="form-label">HARGA BELI</label>
                                <input type="text" name="hargabeli" class="form-control">
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">KETERANGAN</label>
                            <textarea class="form-control" rows="4" name="keterangan"></textarea>
                        </div>
                        <div class="add-choosen">
                            <div class="mb-3">
                                <label class="form-label">IMAGE PRODUK</label>
                                <div class="image-upload ">
                                    <input type="file" name="imageProduk" id="imageproduk">
                                    <div class="image-uploads">
                                        <i data-feather="upload" class="plus-down-add me-0"></i>
                                        <h4>UPLOAD IMAGE PRODUK</h4>
                                    </div>
                                </div>
                            </div>
                            <div class="phone-img"
                                style="width: 150px; height: 150px; overflow: hidden; border-radius: 8px;">
                                <div id="imageProdukPreview" alt="previewImage"
                                    style="width: 150px; height: 150px; display: block; overflow: hidden;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-between">
                        <button type="button" class="btn me-2 btn-secondary" data-bs-dismiss="modal">BATAL</button>
                        <button type="submit" class="btn btn-primary">SIMPAN</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- md Tambah Produk -->
    <div class="modal fade" id="mdEditProduk">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="page-title">
                        <h4>EDIT PRODUK</h4>
                    </div>
                    <button type="button" class="close bg-danger text-white fs-16" data-bs-dismiss="modal"
                        aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form id="formEditProduk" method="POST" enctype="multipart/form-data">
                    @csrf
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-6 mb-3">
                                <label class="form-label">ID</label>
                                <input type="text" name="id" id="editid" class="form-control" readonly>
                            </div>
                            <div class="col-6 mb-3">
                                <label class="form-label">KODE PRODUK</label>
                                <input type="text" name="kodeproduk" id="editkodeprouk" class="form-control"
                                    readonly>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">NAMA<span class="text-danger ms-1">*</span></label>
                            <input type="text" name="nama" id="editnama" class="form-control">
                        </div>
                        <div class="row">
                            <div class="col-6 mb-3">
                                <label class="form-label">JENIS</label>
                                <select class="select" name="jenis" id="editjenis">
                                </select>
                            </div>
                            <div class="col-6 mb-3">
                                <label class="form-label">KONDISI</label>
                                <select class="select" name="kondisi" id="editkondisi">
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-6 mb-3">
                                <label class="form-label">BERAT</label>
                                <input type="text" name="berat" id="editberat" class="form-control">
                            </div>
                            <div class="col-6 mb-3">
                                <label class="form-label">KARAT</label>
                                <input type="text" name="karat" id="editkarat" class="form-control">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-6 mb-3">
                                <label class="form-label">LINGKAR</label>
                                <input type="text" name="lingkar" id="editlingkar" class="form-control">
                            </div>
                            <div class="col-6 mb-3">
                                <label class="form-label">PANJANG</label>
                                <input type="text" name="panjang" id="editpanjang" class="form-control">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-6 mb-3">
                                <label class="form-label">HARGA JUAL</label>
                                <input type="text" name="hargajual" id="edithargajual" class="form-control">
                            </div>
                            <div class="col-6 mb-3">
                                <label class="form-label">HARGA BELI</label>
                                <input type="text" name="hargabeli" id="edithargabeli" class="form-control">
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">KETERANGAN</label>
                            <textarea class="form-control" rows="4" name="keterangan" id="editketerangan"></textarea>
                        </div>
                        <div class="add-choosen">
                            <div class="mb-3">
                                <label class="form-label">IMAGE PRODUK</label>
                                <div class="image-upload ">
                                    <input type="file" name="imageProduk" id="editImageproduk">
                                    <div class="image-uploads">
                                        <i data-feather="upload" class="plus-down-add me-0"></i>
                                        <h4>UPLOAD IMAGE PRODUK</h4>
                                    </div>
                                </div>
                            </div>
                            <div class="phone-img"
                                style="width: 150px; height: 150px; overflow: hidden; border-radius: 8px;">
                                <div id="editImageProdukPreview" alt="previewImage"
                                    style="width: 150px; height: 150px; display: block; overflow: hidden;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn me-2 btn-secondary" data-bs-dismiss="modal">BATAL</button>
                        <button type="submit" class="btn btn-primary">SIMPAN</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Modal Detail Produk -->
    <div class="modal fade" id="modalDetailProduk" tabindex="-1" aria-labelledby="modalDetailProdukLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalDetailProdukLabel">Detail Produk</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- Konten dari page-wrapper kamu, tanpa <html> dan <body> -->
                    <style>
                        .product-slide .slider-product {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            text-align: center;
                        }

                        .product-slide .slider-product img {
                            max-width: 100%;
                            height: auto;
                        }
                    </style>
                    <div class="row">
                        <div class="col-lg-8 col-sm-12">
                            <div class="card">
                                <div class="card-body">
                                    <div class="bar-code-view">
                                        <img src="" id="detailbarcode" alt="barcode" width="100px">
                                        <a class="printimg">
                                            <img src="{{ asset('assets') }}/img/icons/printer.svg" alt="print">
                                        </a>
                                    </div>
                                    <div class="productdetails">
                                        <ul class="product-bar">
                                            <li>
                                                <h4>KODE PRODUK</h4>
                                                <h6 id="detailkodeproduk"></h6>
                                            </li>
                                            <li>
                                                <h4>JENIS PRODUK</h4>
                                                <h6 id="detailjenisproduk"></h6>
                                            </li>
                                            <li>
                                                <h4>BERAT</h4>
                                                <h6 id="detailberat"></h6>
                                            </li>
                                            <li>
                                                <h4>KARAT</h4>
                                                <h6 id="detailkarat"></h6>
                                            </li>
                                            <li>
                                                <h4>LINGKAR</h4>
                                                <h6 id="detaillingkar"></h6>
                                            </li>
                                            <li>
                                                <h4>PANJANG</h4>
                                                <h6 id="detailpanjang"></h6>
                                            </li>
                                            <li>
                                                <h4>HARGA / GRAM</h4>
                                                <h6 id="detailharga"></h6>
                                            </li>
                                            <li>
                                                <h4>STATUS</h4>
                                                <h6 id="detailstatus"></h6>
                                            </li>
                                            <li>
                                                <h4>KETERANGAN</h4>
                                                <h6 id="detailketerangan"></h6>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4 col-sm-12">
                            <div class="card">
                                <div class="card-body">
                                    <div class="slider-product-details">
                                        <div class="owl-carousel owl-theme product-slide">
                                            <div class="slider-product">
                                                <img src="" id="detailimageProduk" alt="img">
                                                <h4 id="detailnamaImage"></h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <script src="{{ asset('assets/js/jquery-3.7.1.min.js') }}" type="text/javascript"></script>
    <script src="{{ asset('assets/js/pages/master/produk.js') }}"></script>
@endsection
