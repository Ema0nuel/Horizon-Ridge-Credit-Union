Noooooo
build the notification on this schema
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'deposit', 'withdrawal', 'transfer', etc.
  description TEXT,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
  balance_before NUMERIC(12, 2),
  balance_after NUMERIC(12, 2),
  status TEXT DEFAULT 'completed', -- optional: pending, failed, reversed
  created_at TIMESTAMP DEFAULT now()
);
Now my upper nav meu isnt showing guyyy
return it to the previous version in view pattern
But eensure it doesnt overflow in to the edge of the screen, make it like this below code
Rewrite the two files to be exactly like this  in font size, coloring(maintain our light and dark theme) and way it been buildt with refernce to the code below in tailwindcss version, formatting, perform ultra functions and everything like a realtime banking application
Ensure evrything is smooth and flowing very well(Be creative, expressive & logical)
Wonderful UI and very very sharp like this refernce 
<body class="topnav-fixed">
		<!-- WRAPPER -->
	<div id="wrapper" class="wrapper">
		<!-- TOP BAR -->
		<div class="top-bar navbar-fixed-top">
			<div class="container">
				<div class="clearfix">
					<a href="#" class="pull-left toggle-sidebar-collapse"><i class="fa fa-bars"></i></a>
					<!-- logo -->
					<div class="pull-left left logo">
						<a href="home.php"><img src="../../master/uploads/logo.png" alt="West Coast Group Logo" width="100px" height="30px" style=" margin-bottom:10px;"></a>
					</div>
					<!-- end logo -->
					<div class="pull-right right">
						<!-- search box -->

						<!-- end search box -->
						<!-- top-bar-right -->
						<div class="top-bar-right">
							<div class="notifications">
								<ul>
																		<!-- notification: inbox -->
									<li class="notification-item inbox">
										<div class="btn-group">
											<a href="#" class="dropdown-toggle" data-toggle="dropdown">
												<i class="fa fa-envelope"></i><span class="count">1</span>
												<span class="circle"></span>
											</a>
											<ul class="dropdown-menu" role="menu">
												<li class="notification-header">
													<em>1 Recent Messages</em>
												</li>
												<li class="inbox-item clearfix">
													 <a href="read_msg.php?id=65" class="inbox-item text-primary">Account Creation....</a><div class="inbox-item unread clearfix"></div>
												</li><li class="notification-footer">
													<a href="read_msg.php?id='.$result['id'].'" class="inbox-item dropdown-footer">View All Messages</a>
												</li>
											</ul>
										</div>
									</li>
									<!-- end notification: inbox -->
									<!-- notification: general -->

									<!-- end notification: general -->
								</ul>
							</div>
							<!-- logged user and the menu -->
							<div class="logged-user">
								<div class="btn-group">
									<a href="#" class="btn btn-link dropdown-toggle" data-toggle="dropdown">
										<img src="../profilepix/male.png" style="width:40px;height:40px; border-radius:50%;">										<span class="name">Emmanuel  Sunday</span> <span class="caret"></span>
									</a>
									<ul class="dropdown-menu" role="menu">
										<li>
											<a href="profile.php">
												<i class="fa fa-user"></i>
												<span class="text">Profile</span>
											</a>
										</li>
										<li>
											<a href="profile.php?#settings-tab">
												<i class="fa fa-cog"></i>
												<span class="text">Settings</span>
											</a>
										</li>
										<li>
											<a href="Logout.php">
												<i class="fa fa-power-off"></i>
												<span class="text">Logout</span>
											</a>
										</li>
									</ul>
								</div>
							</div>
							<!-- end logged user and the menu -->
						</div>
						<!-- end top-bar-right -->
					</div>
				</div>
			</div>
			<!-- /container -->
		</div>
		<!-- END TOP BAR -->
		<!-- LEFT SIDEBAR -->
		<div id="left-sidebar" class="left-sidebar ">
			<div class="sidebar-minified js-toggle-minified">
				<i class="fa fa-refresh"></i>
			</div>
			<!-- main-nav -->
			<div class="sidebar-scroll">
				<nav class="main-nav">
					<ul class="main-menu">
						<li><a href="home.php"><i class="fa fa-tachometer-alt fa-fw"></i><span class="text" style="opacity: 1;">Dashboard</span>
							</a>

						</li>
						<li><a href="profile.php"><i class="fa fa-user"></i><span class="text" style="opacity: 1;">My Profile </span>
							</a></li>
						<li><a href="account_summary.php" class="active"><i class="fa fa-briefcase"></i><span class="text" style="opacity: 1;">Account Summary </span>
							</a></li>
						<li><a href="deposit.php"><i class="fa fa-money"></i><span class="text" style="opacity: 1;">Deposit </span>
							</a></li>
						<li><a href="#" class="js-sub-menu-toggle"><i class="fa fa-credit-card fa-fw"></i><span class="text" style="opacity: 1;">Funds Transfer</span>
								<i class="toggle-icon fa fa-angle-left"></i></a>
							<ul class="sub-menu ">
								<li><a href="interbank_transfer.php"><i class="fa fa-bank fa-fw"></i><span class="text">Inter-Bank Transfer</span></a></li>
								<li><a href="local_transfer.php"><i class="fa fa-street-view fa-fw"></i><span class="text">Local Transfer</span></a></li>
								<li><a href="wire_transfer.php"><i class="fa fa-coins fa-fw"></i><span class="text">Wire Transfer</span></a></li>

							</ul>
						</li>
						<li><a href="#" class="js-sub-menu-toggle"><i class="fa fa-cog fw"></i><span class="text" style="opacity: 1;">Settings</span>
								<i class="toggle-icon fa fa-angle-left"></i></a>
							<ul class="sub-menu ">
								<li><a href="profile.php?#settings-tab"><i class="fa fa-edit "></i><span class="text">Edit Profile</span></a></li>
							</ul>
						</li>
						<li><a href="#" class="js-sub-menu-toggle"><i class="fa fa-bank"></i><span class="text" style="opacity: 1;">Personal Banking</span>
								<i class="toggle-icon fa fa-angle-left"></i></a>
							<ul class="sub-menu ">
								<li><a href="message.php"><i class="fa fa-envelope fw"></i><span class="text">Contact Us</span></a></li>

							</ul>
						</li>
						<li><a href="withdrawal.php"><i class="fa fa-donate"></i><span class="text" style="opacity: 1;">Withdrawal </span>
							</a></li>
						<li><a href="Logout.php"><i class="fa fa fa-power-off"></i><span class="text" style="opacity: 1;">Logout</span></a></li>

					</ul>
				</nav>
				<!-- /main-nav -->
			</div>
		</div>
		<!-- END LEFT SIDEBAR -->
		<!-- MAIN CONTENT WRAPPER -->
		<div id="main-content-wrapper" class="content-wrapper " style="min-height: 482px;">

			<div class="row">
				<div class="col-lg-4 ">
					<ul class="breadcrumb">
						<li><i class="fa fa-home"></i><a href="#">Home</a></li>
						<li class="active">Dashboard</li>
					</ul>
				</div>
				<div class="col-lg-8 ">
					<div class="top-content">
						<ul class="list-inline quick-access">

							<li>
								<a href="#">
									<div class="quick-access-item bg-color-green">
										<i class="fa  fa-refresh"></i>
										<h5><strong>in-active</strong></h5><em>Account Status</em>
									</div>
								</a>
							</li>
							<li>
								<a href="#">
									<div class="quick-access-item bg-color-orange">
										<i class="fa fa-star"></i>
										<h5><strong>USD SAVING</strong></h5><em>Account Type</em>
									</div>
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<!-- main -->
			<div class="content">
				<div class="main-header">
					<h2>Emmanuel Sunday</h2>
					<em class="text-danger">Account Holder</em> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

					<h2>8949347131</h2>
					<em class="text-danger">Account Number</em>
				</div>
				<div class="main-content">
					<div class="row bottom-60px">
						<div class="col-sm-4" style="margin-bottom: 5%;">
							<div class="investment-summary text-center">
								<i class="fa fa-briefcase text-danger" style="font-size:2.5em;"></i> <span class="info-label" style="font-size: 1.2em;">Account Balance</span>
								<strong>$0.00</strong>
							</div>
						</div>
						<div class="col-sm-4" style="margin-bottom: 5%;">
							<div class="investment-summary text-center">
								<i class="fa fa-donate text-danger" style="font-size:3em;"></i><span class="info-label">Mortgage Balance</span>
								<strong>$0.00</strong>
							</div>
						</div>
						<div class="col-sm-4">
							<div class="investment-summary text-center">
								<i class="fa fa-coins text-danger" style="font-size:3em;"></i> <span class="info-label">Loan Balance</span>
								<strong>$0.00</strong>
							</div>
						</div>
					</div>

					<div class="row">
						<div class="col-md-6">
							<!-- WIDGET VISIT AND SALES CHART -->
							<div class="widget">
								<div class="widget-header">
									<h3><i class="fa fa-envelope"></i> Latest Bank Notification</h3>
									<div class="btn-group widget-header-toolbar">
										<a href="#" title="Focus" class="btn-borderless btn-focus"><i class="fa fa-eye"></i></a>
										<a href="#" title="Expand/Collapse" class="btn-borderless btn-toggle-expand"><i class="fa fa-chevron-up"></i></a>

									</div>
								</div>
								<div class="widget-content">
									<div class="alert alert-success">Hello Mr.  Emmanuel Sunday, Welcome to West Coast Group! Your bank account with Account 8949347131 has been Created <br> Time:  2025-07-01 09:24:19</div>								</div>

							</div>
							<!-- END WIDGET VISIT AND SALES CHART -->
						</div>
						<div class="col-md-6">
							<!-- SALES INFO SUMMARY -->
							<div class="widget">
								<div class="widget-header">
									<h3><i class="fa fa-exchange"></i> Latest Transfer Made</h3>
									<div class="btn-group widget-header-toolbar">
										<a href="#" title="Focus" class="btn-borderless btn-focus"><i class="fa fa-eye"></i></a>
										<a href="#" title="Expand/Collapse" class="btn-borderless btn-toggle-expand"><i class="fa fa-chevron-up"></i></a>

									</div>
								</div>
								<div class="widget-content">

									<div class="table-responsive">
										<table class="table table-bordered bottom-30px">
											<thead>
												<tr>

													<th scope="col">Date and Time</th>
													<th scope="col">Beneficiary Bank</th>
													<th scope="col">Beneficiary Name</th>
													<th scope="col">Beneficiary Account Number</th>
													<th scope="col">Amount</th>
												</tr>
											</thead>
											<tbody>

												

															
											</tbody>
										</table>
									</div>

								</div>
							</div>
							<!-- END SALES INFO SUMMARY -->
						</div>
					</div>
					<div class="row">
						<div class="col-md-12">
							<!-- WIDGET VISIT AND SALES CHART -->
							<div class="widget">
								<div class="widget-header">
									<h3><i class="fa fa-money"></i> Financial Statement Review</h3>
									<div class="btn-group widget-header-toolbar">
										<a href="#" title="Focus" class="btn-borderless btn-focus"><i class="fa fa-eye"></i></a>
										<a href="#" title="Expand/Collapse" class="btn-borderless btn-toggle-expand"><i class="fa fa-chevron-up"></i></a>

									</div>
								</div>
								<div class="widget-content">

									<h4> <strong> Credit and Debit Statements</strong></h4>

									<div class="table-responsive">
																			</div>
									<a href="account_summary.php" class="btn btn-default btn-sm"><i class="fa fa-receipt"></i> View Account Statement</a>
								</div>

							</div>
							<!-- END WIDGET VISIT AND SALES CHART -->
						</div>
					</div>
				</div>
			</div>
			<!-- /main -->
			<!-- FOOTER -->
			<footer class="footer">
				<strong>Copyright ©<script>
						document.write(new Date().getFullYear());
					</script>2025 </strong> All rights reserved | West Coast Group.
			</footer>
			<!-- END FOOTER -->
		</div>
		<!-- END CONTENT WRAPPER -->
	</div>
	<!-- END WRAPPER -->

	<!-- Javascript -->
	<script src="assets/js/jquery/jquery-2.1.0.min.js"></script>
	<script src="assets/js/bootstrap/bootstrap.js"></script>
	<script src="assets/js/plugins/modernizr/modernizr.js"></script>
	<script src="assets/js/plugins/bootstrap-tour/bootstrap-tour.custom.js"></script>
	<script src="assets/js/plugins/jquery-slimscroll/jquery.slimscroll.min.js"></script>
	<script src="assets/js/king-common.js"></script>


	<script src="//code.jivosite.com/widget/w8YjOOsX0o" async=""></script>




<iframe id="194123123113" style="display: block !important;min-width: unset !important;top: 20px !important;right: -600px !important;opacity: 1 !important;width: 500px !important;height: 595px !important;z-index: 2147483650 !important;border: none !important; border-radius: 6px !important;position:fixed !important; transition: all .5s ease !important; transition-property: all!important" allow="" src="chrome-extension://pgccoaecgcgnhffkjjcaonjoockggmng/adSaver/popup.html"></iframe><div id="my-extension-root" class="my-extension-root" style="width: 1020px; height: 1px; position: fixed; top: 0px; left: 24px; z-index: 2147483641; display: none;"></div><div id="jivo-iframe-container" style="opacity: 0; visibility: hidden; width: 0px; height: 0px; overflow: hidden;"><iframe src="" role="presentation" allow="autoplay" title="Jivochat" name="jivo_container" id="jivo_container" frameborder="no"></iframe></div><jdiv><jdiv class="globalClass__M7SR3 global__h2JHv __light__QfzQm __green__XFVKg jv-ad jv-windows jv-chrome jv-desktop"><jdiv translate="no" class="notranslate" style="animation-duration: 300ms; animation-timing-function: cubic-bezier(0.39, 0.24, 0.21, 0.99); animation-delay: 0s; animation-iteration-count: 1; animation-direction: normal; animation-fill-mode: both; animation-play-state: running; animation-name: Label_CLOSE_WIDGET__FDGC7; display: block; z-index: 2147483646; position: fixed;"><jdiv id="jvLabelWrap" translate="no" class="container__kI0xW __bottom__mt8ZP __isShow__IHkKy notranslate" style="--jv-label-font-size: 15px; --jv-label-font-family: Arial, Arial; --jv-label-font-style: normal; --jv-label-color: #fff; --jv-label-background: linear-gradient(95deg, #de313b 20%, #de313b 80%); --jv-label-background-corner: #de313b; max-width: calc(-80px + 100vw); bottom: 0px; right: 40px;"><jdiv class="icon__JkTPx" style="background-image: url(&quot;data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%3E%0A%20%20%20%20%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M0%200h20v20H0z%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20stroke%3D%22%23fff%22%20stroke-width%3D%221.5%22%20d%3D%22M3%203h14a2%202%200%200%201%202%202v10a2%202%200%200%201-2%202H3a2%202%200%200%201-2-2V5a2%202%200%200%201%202-2z%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20stroke%3D%22%23fff%22%20stroke-width%3D%221.5%22%20d%3D%22M16.074%207.064l-6.01%204.01-6.01-4.01%22%2F%3E%0A%20%20%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A&quot;);"></jdiv><jdiv class="hoverArea__LgqY5"><jdiv class="menu__hNi9d __bottom__fyYIK"></jdiv></jdiv><jdiv class="text__YK8jZ contentTransitionWrap__lnwCc __bottom__kXK_E __isOffline__XFFG7">Send us a message</jdiv><jdiv class="container__BHFF4"><jdiv class="logo__s_4_o"><jdiv class="icon__SwlNr" style="background-image: url(&quot;data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22108%22%20height%3D%2236%22%20viewBox%3D%220%200%20108%2036%22%3E%0A%20%20%20%20%3Cg%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22%23fff%22%20fill-rule%3D%22evenodd%22%20d%3D%22M6.342%2011.967H.957c-.2%200-.4%200-.6.2%200%20.2-.198.2-.198.4v1.993c0%20.2%200%20.4.198.6.2.198.4.198.6.198h2.79v14.36c0%201.397-1.196%202.594-2.392%202.594h-.4c-.2%200-.398%200-.598.2-.2.2-.2.398-.2.598v1.994c0%20.2%200%20.4.2.6.2.198.4.198.6.198h.198c3.192%200%205.785-2.792%205.785-5.984V12.566c0-.2%200-.4-.2-.6h-.398m6.98%200H11.33c-.2%200-.2%200-.4.2s-.2.2-.2.4v14.76c0%20.2%200%20.398.2.598.2.2.4.2.598.2h1.795c.2%200%20.4%200%20.598-.2.2-.2.2-.4.2-.598v-14.76c0-.2%200-.4-.198-.6h-.6m17.154%200H28.88c-.598%200-.997.2-.997.4l-4.388%209.973-4.188-9.974c0-.4-.4-.4-.6-.4h-1.993c-.4%200-.598%200-.598.2-.2.2-.2.4%200%20.6l6.78%2015.357c.2.2.4.4.6.4h.2c.198%200%20.597-.2.597-.4l6.782-15.358c.2-.2.2-.4%200-.598-.2-.2-.4-.2-.6-.2m9.176-.4c-2.193.002-3.988.8-5.584%202.594-1.595%201.597-2.393%203.592-2.393%205.985%200%202.393.798%204.388%202.393%205.984%201.596%201.794%203.39%202.592%205.585%202.592s3.99-.798%205.586-2.593c1.596-1.796%202.394-3.79%202.394-5.985%200-2.393-.798-4.388-2.394-5.984-1.596-1.794-3.59-2.591-5.585-2.591m3.193%2012.165c-.798.998-1.995%201.596-3.192%201.596-1.395%200-2.392-.398-3.39-1.395-.797-.998-1.396-2.194-1.396-3.79%200-1.396.4-2.792%201.397-3.59.798-.997%201.995-1.396%203.39-1.396%201.398%200%202.395.398%203.193%201.395.797.997%201.396%202.194%201.396%203.59s-.6%202.593-1.397%203.59m19.147-.598c-.398-.4-.797-.2-.997%200l-.4.4-.597.597c-.2.2-.4.2-.6.4-.198.2-.597.398-.796.398-.4%200-.6.2-.998.2-1.396%200-2.393-.6-3.19-1.596-.8-.998-1.397-2.194-1.397-3.79%200-1.396.4-2.792%201.396-3.79.998-.997%201.996-1.396%203.392-1.396%201.197%200%202.194.6%203.19%201.596.4.4.8.4.998.2l1.197-1.197s0-.4-.4-.8c-1.395-1.794-3.39-2.79-5.584-2.79-2.194-.002-3.99.796-5.584%202.59-1.597%201.597-2.395%203.592-2.395%205.985%200%202.393.798%204.388%202.394%206.183%201.594%201.596%203.39%202.394%205.583%202.394%202.593%200%204.588-1.197%205.984-3.39.2-.4.2-.8-.2-1.198l-.997-.997m11.57-11.569c-1.597%200-2.993.6-4.59%201.796V4.986c0-.2%200-.4-.198-.598-.2-.2-.4-.2-.6-.2H66.38c-.2%200-.398%200-.598.2-.2.2-.2.4-.2.598v22.54c0%20.198%200%20.398.2.597.2.2.4.2.598.2h1.796c.598%200%20.797-.2.797-.798V17.353c.2-.6.8-.998%201.398-1.596.797-.598%201.795-.798%202.792-.798.997%200%201.795.398%202.393%201.196.6.798.798%201.795.798%203.19v8.378c0%20.2%200%20.4.2.6.2.198.4.198.6.198h1.794c.2%200%20.4%200%20.6-.2.198-.2.198-.398.198-.598v-8.177c-.2-5.386-2.194-7.979-6.183-7.979m20.144%201.995c-.4-.798-.997-1.197-1.596-1.596-.798-.4-1.795-.598-2.992-.598-1.994%200-3.79.398-5.385.996-.398.2-.597.4-.597.998l.4%201.396c.198.598.398.798.796.598a12.823%2012.823%200%200%201%204.388-.798c.997%200%201.595.2%201.994.798.4.598.598%201.596.4%202.793l-.4-.2c-.2%200-.598-.198-1.197-.198-.4.2-.797.2-1.396.2-1.995%200-3.392.398-4.588%201.395-1.197.997-1.596%202.194-1.596%203.79s.4%202.992%201.396%203.99c.998.996%202.194%201.395%203.59%201.395%201.796%200%203.39-.598%204.787-1.994l.398%201.196c.2.4.4.6.6.6h1.195c.2%200%20.4%200%20.6-.2.198-.2.198-.4.198-.6V18.75c0-1.198%200-2.195-.198-2.993-.2-.598-.4-1.396-.798-2.194M91.31%2023.735c-.2.4-.797.998-1.396%201.396-.798.4-1.396.6-2.194.6s-1.396-.2-1.795-.798c-.4-.4-.598-1.197-.598-1.795%200-.798.2-1.396.798-1.995.598-.4%201.396-.797%202.393-.797.598%200%201.197%200%201.795.2.6.198.997.198.997.398v2.792m16.555%202.793l-.598-1.596c-.2-.4-.4-.598-.997-.4a3.834%203.834%200%200%201-2.394.8c-.4%200-.798-.2-.997-.4-.2-.2-.4-.598-.4-1.396V14.96h4.19c.198%200%20.397%200%20.597-.2.2-.2.2-.4.2-.6v-1.594c0-.2%200-.4-.2-.6h-4.788V7.38c0-.2%200-.4-.2-.598-.2-.2-.398-.2-.598-.2h-1.994c-.2%200-.4%200-.6.2-.198.2-.198.398-.198.598v4.587h-1.795c-.4%200-.798.2-.798.798v1.396c0%20.2%200%20.4.2.6.2.2.398.2.598.2h1.795v8.975c0%201.595.2%202.792.798%203.59.598.798%201.595%201.197%202.99%201.197.8%200%201.597-.2%202.395-.4s1.396-.598%201.795-.797c.997-.2%201.197-.598.997-.997z%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22%2362666c%22%20fill-rule%3D%22evenodd%22%20d%3D%22M6.94%2010.77C6.543.4.16%200%20.16%200c-.4%209.374%206.78%2010.77%206.78%2010.77z%22%2F%3E%0A%20%20%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A&quot;);"></jdiv></jdiv><jdiv class="tooltipWrapper__bEfBL"><jdiv class="tooltip__ZR591"><a href="https://www.jivochat.com/i_sa/?utm_source=westcoastsgroup.com&amp;utm_medium=link&amp;utm_content=label_tooltip&amp;utm_campaign=from_widget" rel="nofollow noopener noreferrer" target="_blank" class="link__NkWuo">Business Messenger by <jdiv class="icon__SwlNr" style="background-image: url(&quot;data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22108%22%20height%3D%2236%22%20viewBox%3D%220%200%20108%2036%22%3E%0A%20%20%20%20%3Cg%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22%23fff%22%20fill-rule%3D%22evenodd%22%20d%3D%22M6.342%2011.967H.957c-.2%200-.4%200-.6.2%200%20.2-.198.2-.198.4v1.993c0%20.2%200%20.4.198.6.2.198.4.198.6.198h2.79v14.36c0%201.397-1.196%202.594-2.392%202.594h-.4c-.2%200-.398%200-.598.2-.2.2-.2.398-.2.598v1.994c0%20.2%200%20.4.2.6.2.198.4.198.6.198h.198c3.192%200%205.785-2.792%205.785-5.984V12.566c0-.2%200-.4-.2-.6h-.398m6.98%200H11.33c-.2%200-.2%200-.4.2s-.2.2-.2.4v14.76c0%20.2%200%20.398.2.598.2.2.4.2.598.2h1.795c.2%200%20.4%200%20.598-.2.2-.2.2-.4.2-.598v-14.76c0-.2%200-.4-.198-.6h-.6m17.154%200H28.88c-.598%200-.997.2-.997.4l-4.388%209.973-4.188-9.974c0-.4-.4-.4-.6-.4h-1.993c-.4%200-.598%200-.598.2-.2.2-.2.4%200%20.6l6.78%2015.357c.2.2.4.4.6.4h.2c.198%200%20.597-.2.597-.4l6.782-15.358c.2-.2.2-.4%200-.598-.2-.2-.4-.2-.6-.2m9.176-.4c-2.193.002-3.988.8-5.584%202.594-1.595%201.597-2.393%203.592-2.393%205.985%200%202.393.798%204.388%202.393%205.984%201.596%201.794%203.39%202.592%205.585%202.592s3.99-.798%205.586-2.593c1.596-1.796%202.394-3.79%202.394-5.985%200-2.393-.798-4.388-2.394-5.984-1.596-1.794-3.59-2.591-5.585-2.591m3.193%2012.165c-.798.998-1.995%201.596-3.192%201.596-1.395%200-2.392-.398-3.39-1.395-.797-.998-1.396-2.194-1.396-3.79%200-1.396.4-2.792%201.397-3.59.798-.997%201.995-1.396%203.39-1.396%201.398%200%202.395.398%203.193%201.395.797.997%201.396%202.194%201.396%203.59s-.6%202.593-1.397%203.59m19.147-.598c-.398-.4-.797-.2-.997%200l-.4.4-.597.597c-.2.2-.4.2-.6.4-.198.2-.597.398-.796.398-.4%200-.6.2-.998.2-1.396%200-2.393-.6-3.19-1.596-.8-.998-1.397-2.194-1.397-3.79%200-1.396.4-2.792%201.396-3.79.998-.997%201.996-1.396%203.392-1.396%201.197%200%202.194.6%203.19%201.596.4.4.8.4.998.2l1.197-1.197s0-.4-.4-.8c-1.395-1.794-3.39-2.79-5.584-2.79-2.194-.002-3.99.796-5.584%202.59-1.597%201.597-2.395%203.592-2.395%205.985%200%202.393.798%204.388%202.394%206.183%201.594%201.596%203.39%202.394%205.583%202.394%202.593%200%204.588-1.197%205.984-3.39.2-.4.2-.8-.2-1.198l-.997-.997m11.57-11.569c-1.597%200-2.993.6-4.59%201.796V4.986c0-.2%200-.4-.198-.598-.2-.2-.4-.2-.6-.2H66.38c-.2%200-.398%200-.598.2-.2.2-.2.4-.2.598v22.54c0%20.198%200%20.398.2.597.2.2.4.2.598.2h1.796c.598%200%20.797-.2.797-.798V17.353c.2-.6.8-.998%201.398-1.596.797-.598%201.795-.798%202.792-.798.997%200%201.795.398%202.393%201.196.6.798.798%201.795.798%203.19v8.378c0%20.2%200%20.4.2.6.2.198.4.198.6.198h1.794c.2%200%20.4%200%20.6-.2.198-.2.198-.398.198-.598v-8.177c-.2-5.386-2.194-7.979-6.183-7.979m20.144%201.995c-.4-.798-.997-1.197-1.596-1.596-.798-.4-1.795-.598-2.992-.598-1.994%200-3.79.398-5.385.996-.398.2-.597.4-.597.998l.4%201.396c.198.598.398.798.796.598a12.823%2012.823%200%200%201%204.388-.798c.997%200%201.595.2%201.994.798.4.598.598%201.596.4%202.793l-.4-.2c-.2%200-.598-.198-1.197-.198-.4.2-.797.2-1.396.2-1.995%200-3.392.398-4.588%201.395-1.197.997-1.596%202.194-1.596%203.79s.4%202.992%201.396%203.99c.998.996%202.194%201.395%203.59%201.395%201.796%200%203.39-.598%204.787-1.994l.398%201.196c.2.4.4.6.6.6h1.195c.2%200%20.4%200%20.6-.2.198-.2.198-.4.198-.6V18.75c0-1.198%200-2.195-.198-2.993-.2-.598-.4-1.396-.798-2.194M91.31%2023.735c-.2.4-.797.998-1.396%201.396-.798.4-1.396.6-2.194.6s-1.396-.2-1.795-.798c-.4-.4-.598-1.197-.598-1.795%200-.798.2-1.396.798-1.995.598-.4%201.396-.797%202.393-.797.598%200%201.197%200%201.795.2.6.198.997.198.997.398v2.792m16.555%202.793l-.598-1.596c-.2-.4-.4-.598-.997-.4a3.834%203.834%200%200%201-2.394.8c-.4%200-.798-.2-.997-.4-.2-.2-.4-.598-.4-1.396V14.96h4.19c.198%200%20.397%200%20.597-.2.2-.2.2-.4.2-.6v-1.594c0-.2%200-.4-.2-.6h-4.788V7.38c0-.2%200-.4-.2-.598-.2-.2-.398-.2-.598-.2h-1.994c-.2%200-.4%200-.6.2-.198.2-.198.398-.198.598v4.587h-1.795c-.4%200-.798.2-.798.798v1.396c0%20.2%200%20.4.2.6.2.2.398.2.598.2h1.795v8.975c0%201.595.2%202.792.798%203.59.598.798%201.595%201.197%202.99%201.197.8%200%201.597-.2%202.395-.4s1.396-.598%201.795-.797c.997-.2%201.197-.598.997-.997z%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22%2362666c%22%20fill-rule%3D%22evenodd%22%20d%3D%22M6.94%2010.77C6.543.4.16%200%20.16%200c-.4%209.374%206.78%2010.77%206.78%2010.77z%22%2F%3E%0A%20%20%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A&quot;);"></jdiv></a></jdiv></jdiv></jdiv><jdiv class="leaf__Kh313"><jdiv class="leaf__Jgi93 _bottom__tWUHb"><jdiv class="cssLeaf__yYQZd" style="background-image: url(&quot;data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2232%22%20height%3D%2240%22%20viewBox%3D%220%200%2032%2040%22%3E%0A%20%20%20%20%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22%23de313b%22%20d%3D%22M0%200h9.02L32%2033.196V40H0z%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22%23de313b%22%20d%3D%22M9%200c3.581.05%2023%205.426%2023%2033.08v.03C18.922%2030.751%209%2019.311%209%205.554V0z%22%20fill-opacity%3D%221%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22%235e5f61%22%20d%3D%22M9%200c3.581.05%2023%205.426%2023%2033.08v.03C18.922%2030.751%209%2019.311%209%205.554V0z%22%20fill-opacity%3D%220.7%22%2F%3E%0A%20%20%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A&quot;);"></jdiv></jdiv></jdiv></jdiv></jdiv><jdiv id="jivo-player" class="player__GKVya"><audio preload="auto" id="jivo-sound-agent_message"><source src="https://code.jivosite.com/sounds/agent_message.mp3" type="audio/mpeg"><source src="https://code.jivosite.com/sounds/agent_message.ogg" type="audio/ogg; codecs=vorbis"><source src="https://code.jivosite.com/sounds/agent_message.wav" type="audio/wav"></audio><audio preload="auto" id="jivo-sound-notification"><source src="https://code.jivosite.com/sounds/notification.mp3" type="audio/mpeg"><source src="https://code.jivosite.com/sounds/notification.ogg" type="audio/ogg; codecs=vorbis"><source src="https://code.jivosite.com/sounds/notification.wav" type="audio/wav"></audio><audio preload="auto" id="jivo-sound-outgoing_message"><source src="https://code.jivosite.com/sounds/outgoing_message.mp3" type="audio/mpeg"><source src="https://code.jivosite.com/sounds/outgoing_message.ogg" type="audio/ogg; codecs=vorbis"><source src="https://code.jivosite.com/sounds/outgoing_message.wav" type="audio/wav"></audio></jdiv><jdiv id="jcont" translate="no" class="notranslate" style="animation-duration: 300ms; animation-timing-function: cubic-bezier(0.39, 0.24, 0.21, 0.99); animation-delay: 0s; animation-iteration-count: 1; animation-direction: normal; animation-fill-mode: both; animation-play-state: running; animation-name: WidgetContainer_CLOSE_WIDGET__t4qnn; --jright: 30px; --jheight: 418px; display: block; position: fixed; --jlabelwidth: 300px; --jlabelright: 40px;"><jdiv dir="ltr" id="jivo_action" class="wrap__oIQUj"><jdiv id="jivo_close_button" class="closeButton__gM163"><jdiv class="closeIcon__F18Yq" style="background-image: url(&quot;data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2228%22%20height%3D%2228%22%20viewBox%3D%220%200%2028%2028%22%3E%0A%20%20%20%20%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%20transform%3D%22translate(2%202)%22%3E%0A%20%20%20%20%20%20%20%20%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%2212%22%20fill%3D%22%23FFF%22%20opacity%3D%221%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%2212.75%22%20stroke%3D%22%23222D38%22%20stroke-width%3D%221.5%22%20opacity%3D%221%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cg%20fill%3D%22%23222D38%22%20opacity%3D%221%22%20transform%3D%22translate(6%206)%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Crect%20width%3D%221.611%22%20height%3D%2213.9%22%20x%3D%225.435%22%20y%3D%22-.941%22%20rx%3D%22.806%22%20transform%3D%22rotate(45%206.24%206.01)%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Crect%20width%3D%221.611%22%20height%3D%2213.9%22%20x%3D%225.435%22%20y%3D%22-.941%22%20rx%3D%22.806%22%20transform%3D%22scale(-1%201)%20rotate(45%200%20-9.058)%22%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2Fg%3E%0A%20%20%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A&quot;);"></jdiv></jdiv></jdiv></jdiv><jdiv class="jv-pseudo-height"></jdiv><jdiv class="jv-mouse-track"></jdiv></jdiv></jdiv></body>
import { renderThemeToggle } from "../../../components/themeToggle";
import { checkSession } from "../functions/checkSession";
import { showToast } from "../../../components/toast"

const navbar = () => {
    async function pageEvents() {
        const sessionData = await checkSession();
        if (sessionData && sessionData.profile) {
            document.querySelector('.name').textContent = sessionData.profile.full_name;
        }
        const logout = document.getElementById("logout");
        if (logout) {
            logout.addEventListener("click", async () => {
                await supabase.auth.signOut();
                showToast("You have been logged out.", "success");
                setTimeout(() => {
                    window.location.href = "/";
                }, 1000);
            });
        }
        const logoutBtn = document.getElementById("log-out");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", async () => {
                await supabase.auth.signOut();
                showToast("You have been logged out.", "success");
                setTimeout(() => {
                    window.location.href = "/";
                }, 1000);
            });
        }
        // Theme toggle
        const navActions = document.getElementById("nav-actions");
        const themeToggleBtn = renderThemeToggle();
        navActions && navActions.appendChild(themeToggleBtn);

        // Sidebar toggle (mobile & desktop)
        const sidebarToggle = document.getElementById("sidebar-toggle");
        const leftSidebar = document.getElementById("left-sidebar");
        if (sidebarToggle && leftSidebar) {
            sidebarToggle.addEventListener("click", () => {
                leftSidebar.classList.toggle("translate-x-0");
                leftSidebar.classList.toggle("-translate-x-full");
                leftSidebar.classList.toggle("md:-translate-x-0");
                leftSidebar.classList.toggle("md:translate-x-0");
                leftSidebar.classList.toggle("opacity-100");
                leftSidebar.classList.toggle("opacity-0");
            });
        }

        // Hide aside on desktop with close button
        const sidebarClose = document.getElementById("sidebar-close");
        if (sidebarClose && leftSidebar) {
            sidebarClose.addEventListener("click", () => {
                leftSidebar.classList.add("-translate-x-full", "opacity-0");
                leftSidebar.classList.remove("translate-x-0", "opacity-100");
            });
        }

        // Submenu toggles
        document.querySelectorAll(".js-sub-menu-toggle").forEach(btn => {
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                const submenu = this.nextElementSibling;
                if (submenu) submenu.classList.toggle("hidden");
                this.querySelector(".toggle-icon")?.classList.toggle("rotate-90");
            });
        });

        // User dropdown
        const userMenuBtn = document.getElementById("user-menu-btn");
        const userMenuDropdown = document.getElementById("user-menu-dropdown");
        if (userMenuBtn && userMenuDropdown) {
            userMenuBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                userMenuDropdown.classList.toggle("hidden");
            });
            document.addEventListener("click", (e) => {
                if (!userMenuDropdown.contains(e.target) && e.target !== userMenuBtn) {
                    userMenuDropdown.classList.add("hidden");
                }
            });
        }

        // Notification dropdown
        const notifBtn = document.getElementById("notif-btn");
        const notifDropdown = document.getElementById("notif-dropdown");
        if (notifBtn && notifDropdown) {
            notifBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                notifDropdown.classList.toggle("hidden");
            });
            document.addEventListener("click", (e) => {
                if (!notifDropdown.contains(e.target) && e.target !== notifBtn) {
                    notifDropdown.classList.add("hidden");
                }
            });
        }
    }

    return {
        html: /* html */`
        <div class="top-bar navbar-fixed-top w-full bg-white dark:bg-brand-dark border-b border-gray-200 dark:border-brand-navy shadow z-40">
            <div class="container mx-auto px-2 md:px-6">
                <div class="flex items-center justify-between py-2">
                    <!-- Sidebar Toggle & Logo -->
                    <div class="flex items-center gap-3">
                        <button id="sidebar-toggle" class="p-2 rounded-full bg-brand-sun text-white focus:outline-none focus:ring-2 focus:ring-brand-navy transition md:inline-block">
                            <i class="fa fa-bars"></i>
                        </button>
                        <div class="logo">
                            <a href="/" data-nav>
                                <img src="/src/images/logo.jpg" alt="Horizon Ridge Credit Union Logo" class="h-8 w-auto" style="margin-bottom:6px;">
                            </a>
                        </div>
                    </div>
                    <!-- Right Side -->
                    <div class="flex items-center gap-4">
                        <!-- User Menu -->
                        <div class="relative">
                            <button id="user-menu-btn" class="flex items-center gap-2 btn btn-link dropdown-toggle focus:outline-none">
                                <img src="/src/images/user/user.png" alt="User" class="w-10 h-10 rounded-full object-cover border-2 border-brand-sun" />
                                <span class="name font-semibold text-brand-navy dark:text-brand-sun"></span>
                                <span class="caret"><i class="fa fa-caret-down"></i></span>
                            </button>
                            <ul id="user-menu-dropdown" class="dropdown-menu absolute right-0 mt-2 w-44 bg-white dark:bg-brand-dark border border-gray-200 dark:border-brand-navy rounded shadow-lg z-50 hidden">
                                <li>
                                    <a href="/profile" data-nav class="flex items-center px-4 py-2 hover:bg-brand-sun/10 dark:hover:bg-brand-teal/20">
                                        <i class="fa fa-user mr-2"></i> <span class="text">Profile</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="/profile#settings-tab" data-nav class="flex items-center px-4 py-2 hover:bg-brand-sun/10 dark:hover:bg-brand-teal/20">
                                        <i class="fa fa-cog mr-2"></i> <span class="text">Settings</span>
                                    </a>
                                </li>
                                <li>
                                    <a class="cursor-pointer flex items-center px-4 py-2 hover:bg-brand-sun/10 dark:hover:bg-brand-teal/20" id="log-out">
                                        <i class="fa fa-power-off mr-2"></i> <span class="text">Logout</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div id="nav-actions" class="flex items-center gap-2 ml-2"></div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Aside Sidebar -->
        <aside id="left-sidebar"
            class="left-sidebar fixed top-0 left-0 h-screen w-64 bg-white dark:bg-brand-dark border-r border-brand-gray dark:border-brand-navy shadow-lg z-30 flex flex-col transition-all duration-300
            -translate-x-full opacity-0 md:translate-x-0 md:opacity-100">
            <div class="flex items-center justify-between py-2 px-4 border-b border-gray-200 dark:border-brand-navy">
                <span class="font-bold text-brand-navy dark:text-brand-sun text-lg">Menu</span>
                <button id="sidebar-close" class="p-2 rounded-full bg-brand-sun text-white focus:outline-none focus:ring-2 focus:ring-brand-navy transition md:inline-block">
                    <i class="fa fa-times"></i>
                </button>
            </div>
            <div class="sidebar-scroll flex-1 overflow-y-auto">
                <nav class="main-nav mt-2">
                    <ul class="main-menu space-y-1 px-2">
                        <li>
                            <a href="/dashboard" data-nav class="flex items-center px-3 py-2 rounded hover:bg-brand-sun/10 dark:hover:bg-brand-teal/20 transition">
                                <i class="fa fa-tachometer-alt fa-fw mr-3"></i>
                                <span class="text">Dashboard</span>
                            </a>
                        </li>
                        <li>
                            <a href="/profile" data-nav class="flex items-center px-3 py-2 rounded hover:bg-brand-sun/10 dark:hover:bg-brand-teal/20 transition">
                                <i class="fa fa-user mr-3"></i>
                                <span class="text">My Profile</span>
                            </a>
                        </li>
                        <li>
                            <a href="/account-summary" data-nav class="flex items-center px-3 py-2 rounded hover:bg-brand-sun/10 dark:hover:bg-brand-teal/20 transition">
                                <i class="fa fa-briefcase mr-3"></i>
                                <span class="text">Account Summary</span>
                            </a>
                        </li>
                        <li>
                            <a href="/deposit" data-nav class="flex items-center px-3 py-2 rounded hover:bg-brand-sun/10 dark:hover:bg-brand-teal/20 transition">
                                <i class="fa fa-money mr-3"></i>
                                <span class="text">Deposit</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" class="flex items-center px-3 py-2 rounded hover:bg-brand-sun/10 dark:hover:bg-brand-teal/20 transition js-sub-menu-toggle">
                                <i class="fa fa-credit-card fa-fw mr-3"></i>
                                <span class="text">Funds Transfer</span>
                                <i class="toggle-icon fa fa-angle-left ml-auto transition-transform"></i>
                            </a>
                            <ul class="sub-menu ml-8 mt-1 space-y-1 hidden">
                                <li>
                                    <a href="/interbank-transfer" data-nav class="flex items-center px-2 py-2 hover:bg-brand-sun/10 dark:hover:bg-brand-teal/20 transition">
                                        <i class="fa fa-bank fa-fw mr-2"></i>
                                        <span class="text">Inter-Bank Transfer</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="/local-transfer" data-nav class="flex items-center px-2 py-2 hover:bg-brand-sun/10 dark:hover:bg-brand-teal/20 transition">
                                        <i class="fa fa-street-view fa-fw mr-2"></i>
                                        <span class="text">Local Transfer</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="/wire-transfer" data-nav class="flex items-center px-2 py-2 hover:bg-brand-sun/10 dark:hover:bg-brand-teal/20 transition">
                                        <i class="fa fa-coins fa-fw mr-2"></i>
                                        <span class="text">Wire Transfer</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="#" class="flex items-center px-3 py-2 rounded hover:bg-brand-sun/10 dark:hover:bg-brand-teal/20 transition js-sub-menu-toggle">
                                <i class="fa fa-cog fa-fw mr-3"></i>
                                <span class="text">Settings</span>
                                <i class="toggle-icon fa fa-angle-left ml-auto transition-transform"></i>
                            </a>
                            <ul class="sub-menu ml-8 mt-1 space-y-1 hidden">
                                <li>
                                    <a href="/profile#settings-tab" data-nav class="flex items-center px-2 py-2 hover:bg-brand-sun/10 dark:hover:bg-brand-teal/20 transition">
                                        <i class="fa fa-edit mr-2"></i>
                                        <span class="text">Edit Profile</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="#" class="flex items-center px-3 py-2 rounded hover:bg-brand-sun/10 dark:hover:bg-brand-teal/20 transition js-sub-menu-toggle">
                                <i class="fa fa-bank mr-3"></i>
                                <span class="text">Personal Banking</span>
                                <i class="toggle-icon fa fa-angle-left ml-auto transition-transform"></i>
                            </a>
                            <ul class="sub-menu ml-8 mt-1 space-y-1 hidden">
                                <li>
                                    <a href="/contact" data-nav class="flex items-center px-2 py-2 hover:bg-brand-sun/10 dark:hover:bg-brand-teal/20 transition">
                                        <i class="fa fa-envelope mr-2"></i>
                                        <span class="text">Contact Us</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="/withdrawal" data-nav class="flex items-center px-3 py-2 rounded hover:bg-brand-sun/10 dark:hover:bg-brand-teal/20 transition">
                                <i class="fa fa-donate mr-3"></i>
                                <span class="text">Withdrawal</span>
                            </a>
                        </li>
                        <li>
                            <a class="cursor-pointer flex items-center px-3 py-2 rounded hover:bg-brand-sun/10 dark:hover:bg-brand-teal/20 transition" id="logout">
                                <i class="fa fa-power-off mr-3"></i>
                                <span class="text">Logout</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
        `,
        pageEvents
    };
};

export default navbar;

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          sun: '#f59e0b',
          navy: '#1e3a8a',
          teal: '#0f766e',
          gray: '#374151',
          light: '#ffffff', // ✅ used instead of 'white'
          dark: '#111827'   // ✅ used instead of 'black'
        }
      }
    }
  },
  darkMode: 'class',
  plugins: []
};


import { checkSession } from './functions/checkSession';
import { reset } from "../../utils/reset";
import navbar from "./components/Navbar";
import { supabase } from '../../utils/supabaseClient';
import { formatCurrency, formatDate, formatTime } from "../../utils/format";

const dashboard = async () => {
    reset("User | Dashboard");
    const nav = navbar();

    // Fetch session and user data
    const sessionData = await checkSession();
    if (!sessionData) {
        window.location.href = "/login";
        return;
    }
    const { profile, account, user } = sessionData;

    // Fetch notifications (latest 5)
    const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

    // Fetch latest 5 transfers
    const { data: transfers } = await supabase
        .from('transactions')
        .select('*')
        .eq('account_id', account?.id)
        .eq('type', 'transfer')
        .order('created_at', { ascending: false })
        .limit(5);

    // Fetch last 10 transactions for statement
    const { data: statements } = await supabase
        .from('transactions')
        .select('*')
        .eq('account_id', account?.id)
        .order('created_at', { ascending: false })
        .limit(10);

    // Fetch loan info
    const { data: loan } = await supabase
        .from('loan')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    // Fetch cards
    const { data: cards } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', user.id)
        .order('issued_at', { ascending: false });

    function pageEvents() {
        nav.pageEvents?.();
    }

    // Helper for notification rows
    const notificationRows = notifications && notifications.length
        ? notifications.map(n => `
      <div class="rounded bg-green-100 dark:bg-green-900/60 text-green-900 dark:text-green-100 px-4 py-2 mb-2 shadow">
        <span class="font-semibold">${n.title || "Notification"}</span>
        <div class="text-xs">${n.message}</div>
        <div class="text-xs text-gray-500 dark:text-gray-300">${formatDate(n.created_at)} ${formatTime(n.created_at)}</div>
      </div>
    `).join('')
        : `<div class="text-gray-400 dark:text-gray-500 text-sm">No notifications yet.</div>`;

    // Helper for transfer rows
    const transferRows = transfers && transfers.length
        ? transfers.map(t => `
      <tr>
        <td class="px-2 py-1">${formatDate(t.created_at)} ${formatTime(t.created_at)}</td>
        <td class="px-2 py-1">${t.beneficiary_bank || '-'}</td>
        <td class="px-2 py-1">${t.beneficiary_name || '-'}</td>
        <td class="px-2 py-1">${t.beneficiary_account || '-'}</td>
        <td class="px-2 py-1 font-semibold text-brand-sun">${formatCurrency(t.amount)}</td>
      </tr>
    `).join('')
        : `<tr><td colspan="5" class="text-center text-gray-400 dark:text-gray-500 py-2">No transfers found.</td></tr>`;

    // Helper for statement rows
    const statementRows = statements && statements.length
        ? statements.map(s => `
      <tr>
        <td class="px-2 py-1">${formatDate(s.created_at)} ${formatTime(s.created_at)}</td>
        <td class="px-2 py-1">${s.type}</td>
        <td class="px-2 py-1">${s.description || '-'}</td>
        <td class="px-2 py-1 font-semibold text-brand-sun">${formatCurrency(s.amount)}</td>
        <td class="px-2 py-1">${formatCurrency(s.balance_after)}</td>
      </tr>
    `).join('')
        : `<tr><td colspan="5" class="text-center text-gray-400 dark:text-gray-500 py-2">No transactions found.</td></tr>`;

    // Loan balance
    const loanBalance = loan ? Number(loan.amount) - Number(loan.repaid_amount || 0) : 0;

    // Cards
    const cardRows = cards && cards.length
        ? cards.map(card => `
      <div class="rounded-xl bg-gradient-to-br from-brand-sun/80 to-brand-navy/90 text-white p-4 mb-3 shadow flex flex-col md:flex-row items-center justify-between transition-all duration-300">
        <div>
          <div class="font-bold text-lg tracking-widest">${card.card_type?.toUpperCase() || 'CARD'}</div>
          <div class="text-xs tracking-widest">**** **** **** ${card.card_number.slice(-4)}</div>
          <div class="text-xs">Exp: ${card.expiry_date ? formatDate(card.expiry_date) : '--'}</div>
        </div>
        <div class="text-xs mt-2 md:mt-0">${card.is_active ? '<span class="text-green-200">Active</span>' : '<span class="text-red-200">Inactive</span>'}</div>
      </div>
    `).join('')
        : `<div class="text-gray-400 dark:text-gray-500 text-sm">No cards issued.</div>`;

    return {
        html: /* html */ `
      <div class="flex flex-col md:flex-row min-h-screen bg-brand-light dark:bg-brand-dark transition-colors duration-300">
        <!-- Aside Navbar -->
        <aside class="w-full md:w-64 flex-shrink-0">
          ${nav.html}
        </aside>
        <!-- Main Dashboard Content -->
        <main class="flex-1 px-2 md:px-8 py-8">
          <div class="max-w-6xl mx-auto">
            <!-- Account Balance First -->
            <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
              <div class="flex-1 flex flex-col md:flex-row gap-4">
                <div class="rounded-2xl shadow-xl bg-white dark:bg-brand-dark border border-brand-sun/30 p-6 flex flex-col items-center w-full md:w-72 transition-all duration-300">
                  <i class="fa fa-briefcase text-4xl text-brand-navy mb-2"></i>
                  <span class="info-label text-base font-semibold">Account Balance</span>
                  <strong class="text-3xl text-brand-sun mt-1">${formatCurrency(account?.balance)}</strong>
                </div>
                <div class="rounded-2xl shadow-xl bg-white dark:bg-brand-dark border border-brand-sun/30 p-6 flex flex-col items-center w-full md:w-72 transition-all duration-300">
                  <i class="fa fa-hashtag text-3xl text-brand-sun mb-2"></i>
                  <div class="text-lg font-semibold tracking-widest">${account?.account_number || 'N/A'}</div>
                  <div class="text-xs text-brand-gray dark:text-brand-light">Account Number</div>
                </div>
              </div>
              <div class="rounded-2xl shadow-xl bg-white dark:bg-brand-dark border border-brand-sun/30 p-6 flex flex-col items-center w-full md:w-72 transition-all duration-300">
                <i class="fa fa-refresh text-3xl ${account?.is_active ? 'text-green-500' : 'text-red-500'} mb-2"></i>
                <div class="text-lg font-semibold">${account?.is_active ? 'Active' : 'Inactive'}</div>
                <div class="text-xs text-brand-gray dark:text-brand-light">Account Status</div>
                <div class="mt-2 text-xs text-brand-navy dark:text-brand-sun">${account?.account_type || 'USD SAVING'}</div>
              </div>
            </div>
            <!-- User Info -->
            <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
              <div>
                <h1 class="text-3xl font-bold text-brand-navy dark:text-brand-sun">${profile.full_name}</h1>
                <div class="text-xs text-brand-gray dark:text-brand-light mt-1">Account Holder</div>
                <div class="text-xs text-brand-gray dark:text-brand-light mt-1">Member Since: ${formatDate(profile.created_at)}</div>
              </div>
              <div class="flex flex-col md:flex-row gap-4">
                <div class="rounded-xl shadow bg-white dark:bg-brand-dark border border-brand-sun/20 p-4 flex flex-col items-center w-full md:w-48">
                  <i class="fa fa-coins text-2xl text-brand-navy mb-1"></i>
                  <span class="info-label text-sm font-semibold">Loan Balance</span>
                  <strong class="text-xl text-brand-sun">${formatCurrency(loanBalance)}</strong>
                </div>
                <div class="rounded-xl shadow bg-white dark:bg-brand-dark border border-brand-sun/20 p-4 flex flex-col items-center w-full md:w-48">
                  <i class="fa fa-donate text-2xl text-brand-navy mb-1"></i>
                  <span class="info-label text-sm font-semibold">Mortgage Balance</span>
                  <strong class="text-xl text-brand-sun">$0.00</strong>
                </div>
              </div>
            </div>
            <!-- Notifications & Transfers -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div class="rounded-xl shadow-lg bg-white dark:bg-brand-dark border border-brand-sun/20 p-6">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-bold text-brand-navy dark:text-brand-sun"><i class="fa fa-envelope mr-2"></i> Latest Bank Notifications</h3>
                </div>
                <div>
                  ${notificationRows}
                </div>
              </div>
              <div class="rounded-xl shadow-lg bg-white dark:bg-brand-dark border border-brand-sun/20 p-6">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-bold text-brand-navy dark:text-brand-sun"><i class="fa fa-exchange mr-2"></i> Latest Transfers</h3>
                </div>
                <div class="overflow-x-auto">
                  <table class="min-w-full text-sm">
                    <thead>
                      <tr class="bg-brand-sun/10 dark:bg-brand-navy/30">
                        <th class="px-2 py-1 text-left">Date and Time</th>
                        <th class="px-2 py-1 text-left">Beneficiary Bank</th>
                        <th class="px-2 py-1 text-left">Beneficiary Name</th>
                        <th class="px-2 py-1 text-left">Beneficiary Account</th>
                        <th class="px-2 py-1 text-left">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${transferRows}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <!-- Financial Statement -->
            <div class="rounded-xl shadow-lg bg-white dark:bg-brand-dark border border-brand-sun/20 p-6 mb-8">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-brand-navy dark:text-brand-sun"><i class="fa fa-money mr-2"></i> Financial Statement Review</h3>
                <a href="/account-summary" data-nav class="btn btn-sm bg-brand-sun text-white px-3 py-1 rounded hover:bg-brand-navy transition"><i class="fa fa-receipt"></i> View Account Statement</a>
              </div>
              <div class="overflow-x-auto">
                <table class="min-w-full text-sm">
                  <thead>
                    <tr class="bg-brand-sun/10 dark:bg-brand-navy/30">
                      <th class="px-2 py-1 text-left">Date</th>
                      <th class="px-2 py-1 text-left">Type</th>
                      <th class="px-2 py-1 text-left">Description</th>
                      <th class="px-2 py-1 text-left">Amount</th>
                      <th class="px-2 py-1 text-left">Balance After</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${statementRows}
                  </tbody>
                </table>
              </div>
            </div>
            <!-- Cards -->
            <div class="rounded-xl shadow-lg bg-white dark:bg-brand-dark border border-brand-sun/20 p-6 mb-8">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-brand-navy dark:text-brand-sun"><i class="fa fa-credit-card mr-2"></i> Your Cards</h3>
              </div>
              <div>
                ${cardRows}
              </div>
            </div>
          </div>
        </main>
      </div>
    `,
        pageEvents
    };
};

export default dashboard;