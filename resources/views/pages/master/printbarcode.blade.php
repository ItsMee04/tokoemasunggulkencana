@extends('layouts.app')
@section('title', 'Print Barcode')
@section('content')
    <div class="page-wrapper notes-page-wrapper">
        <div class="content">
            <div class="page-header">
                <div class="add-item d-flex">
                    <div class="page-title">
                        <h4>Print Barcode</h4>
                        <h6>Manage your barcodes</h6>
                    </div>
                </div>
                <div class="d-flex align-items-center">
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
                </div>
            </div>
            <div class="barcode-content-list">
                <form>
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="input-blocks search-form seacrh-barcode-item">
                                <div class="searchInput">
                                    <label class="form-label">Product</label>
                                    <input type="text" id="produk-input" class="form-control"
                                        placeholder="CARI DENGAN KODE PRODUK">
                                    <div class="icon"><i class="fas fa-search"></i></div>
                                    <div id="autocomplete-results" class="autocomplete-results"></div>
                                    <input type="hidden" id="produk_id" name="produk_id">
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <div class="col-lg-12">
                    <div class="modal-body-table search-modal-header">
                        <div class="table-responsive">
                            <table id="tableProdukCetakBarcode" class="table table-hover" style="width: 100%">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>PRODUK</th>
                                        <th>KODE PRODUK</th>
                                        <th class="text-center no-sort">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {{-- <tr>
                                        <td class="action-table-data justify-content-center">
                                            <div class="edit-delete-action">
                                                <a class="confirm-text barcode-delete-icon" href="javascript:void(0);">
                                                    <i data-feather="trash-2" class="feather-trash-2"></i>
                                                </a>
                                            </div>
                                        </td>
                                    </tr> --}}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="search-barcode-button">
                    <a href="javascript:void(0);" id="cetakbarcode" class="btn btn-secondary close-btn">
                        <span><i class="fas fa-print me-2"></i></span>
                        Print Barcode</a>
                </div>
            </div>
        </div>
    </div>
    <style>
        /* Input styling */
        .autocomplete-input {
            width: 100%;
            padding: 10px 12px;
            font-size: 14px;
            border: 1px solid #ccc;
            border-radius: 6px;
            outline: none;
            transition: border-color 0.3s ease;
        }

        .autocomplete-input:focus {
            border-color: #007bff;
        }

        /* Dropdown result styling */
        .autocomplete-results {
            position: absolute;
            background: white;
            border: 1px solid #ccc;
            border-top: none;
            max-height: 250px;
            overflow-y: auto;
            width: 100%;
            z-index: 1000;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            border-radius: 0 0 6px 6px;
            font-size: 14px;
        }

        /* Each item */
        .autocomplete-results div {
            padding: 10px 12px;
            cursor: pointer;
            transition: background 0.2s ease;
        }

        .autocomplete-results div:hover {
            background: #f0f0f0;
        }

        /* Optional: highlight matching text */
        .autocomplete-highlight {
            font-weight: bold;
            color: #007bff;
        }
    </style>
    <script src="{{ asset('assets/js/jquery-3.7.1.min.js') }}" type="text/javascript"></script>
    <script src="{{ asset('assets/js/pages/master/printbarcode.js') }}"></script>
@endsection
